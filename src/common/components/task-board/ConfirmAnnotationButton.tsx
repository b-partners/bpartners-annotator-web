import { Annotation, Label, Task, TaskStatus, Whoami } from 'bpartners-annotator-Ts-client';
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { userTasksProvider } from '../../../providers';
import { IAnnotation, useCanvasAnnotationContext } from '../../context';
import { cache } from '../../utils';
import { BpButton } from '../basics';

interface IConfirmButton {
  task: Task;
  label: Label[];
  onEnd: () => void;
  isFetcherLoading: boolean;
}

const areReadyForValidation = (annotations: IAnnotation[]) => {
  for (let i = 0; i < annotations.length; i++) {
    console.log(annotations[i].label);

    if (annotations[i].label.length === 0) return false;
  }
  return true;
};

export const ConfirmAnnotationButton: FC<IConfirmButton> = ({ label, onEnd, task, isFetcherLoading }) => {
  const { annotations, setAnnotations } = useCanvasAnnotationContext();
  const [isLoading, setLoading] = useState(false);
  const params = useParams();

  const handleClick = () => {
    setLoading(true);
    const whoami = cache.getWhoami() as Whoami;
    const userId = whoami.user?.id || '';

    const areReady = areReadyForValidation(annotations);
    if (!areReady) {
      alert('Veuillez donner un label pour chaque annotation.');
      return;
    }
    const taskAnnotation: Annotation[] = annotations.map(annotation => ({
      id: uuidV4(),
      label: label.find(e => e.name === annotation.label),
      taskId: task.id || '',
      polygon: { points: annotation.polygon.points },
      userId,
    }));

    if (taskAnnotation.length === 0) {
      taskAnnotation.push({
        label: undefined,
        id: uuidV4(),
        polygon: undefined,
        taskId: task.id,
        userId,
      });
    }

    Promise.allSettled([
      userTasksProvider.annotateOne(userId, task.id || '', taskAnnotation),
      userTasksProvider.updateOne(params.teamId || '', params.jobId || '', task.id || '', { ...task, status: TaskStatus.COMPLETED }),
    ])
      .then(() => {
        setAnnotations([]);
        onEnd();
      })
      .catch(err => {
        alert((err as Error).message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return <BpButton label='Valider l’annotation' onClick={handleClick} isLoading={isLoading || isFetcherLoading} />;
};
