import { Checkbox, FormControlLabel, Stack } from '@mui/material';
import { Annotation, Label, Polygon, Task, TaskStatus, Whoami } from 'bpartners-annotator-Ts-client';
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { userTasksProvider } from '../../../providers';
import { IAnnotation, useCanvasAnnotationContext } from '../../context';
import { useFetch } from '../../hooks';
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
  const params = useParams();
  const [noAnnotation, setNoAnnotation] = useState(false);

  const createAnnotation = (label?: Label, polygon?: Polygon) => {
    const whoami = cache.getWhoami() as Whoami;
    const userId = whoami.user?.id || '';
    return {
      id: uuidV4(),
      label,
      taskId: task.id || '',
      polygon,
      userId,
    };
  };

  const fetcher = async () => {
    const whoami = cache.getWhoami() as Whoami;
    const userId = whoami.user?.id || '';
    const taskAnnotation: Annotation[] = annotations.map(annotation =>
      createAnnotation(
        label.find(e => e.name === annotation.label),
        { points: annotation.polygon.points }
      )
    );
    if (taskAnnotation.length === 0) taskAnnotation.push(createAnnotation(undefined, { points: [] }));
    try {
      await Promise.allSettled([
        userTasksProvider.annotateOne(userId, task.id || '', taskAnnotation),
        userTasksProvider.updateOne(params.teamId || '', params.jobId || '', task.id || '', { ...task, status: TaskStatus.COMPLETED }),
      ]);
      setAnnotations([]);
      onEnd();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      return;
    }
  };

  const { fetcher: fetch, isLoading } = useFetch(fetcher, true);

  const handleClick = () => {
    const areReady = areReadyForValidation(annotations);
    if (areReady) {
      fetch();
    } else {
      alert('Veuillez donner un label pour chaque annotation.');
    }
  };

  return (
    <Stack>
      <BpButton
        label='Valider l’annotation'
        onClick={handleClick}
        disabled={!noAnnotation && annotations.length === 0}
        isLoading={isLoading || isFetcherLoading}
      />
      <FormControlLabel label='Rien à labelliser' control={<Checkbox value={noAnnotation} onClick={() => setNoAnnotation(e => !e)} />} />
    </Stack>
  );
};
