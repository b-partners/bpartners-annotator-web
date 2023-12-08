import { Annotation, AnnotationBatch, Label, Task, Whoami } from '@bpartners-annotator/typescript-client';
import { Checkbox, FormControlLabel, Stack } from '@mui/material';
import { FC, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { userAnnotationsProvider } from '../../../providers/annotator/user-annotations-provider';
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
  const [noAnnotation, setNoAnnotation] = useState(false);

  const fetcher = async () => {
    const whoami = cache.getWhoami() as Whoami;
    const userId = whoami.user?.id || '';
    const taskAnnotation: Annotation[] = annotations.map(annotation => ({
      id: uuidV4(),
      label: label.find(e => e.name === annotation.label),
      taskId: task.id || '',
      polygon: { points: annotation.polygon.points },
      userId,
    }));

    const annotationBatch: AnnotationBatch = { id: uuidV4(), annotations: taskAnnotation };
    try {
      await userAnnotationsProvider.annotate(userId, task.id || '', annotationBatch.id || '', annotationBatch);
      setAnnotations([]);
      onEnd();
      setNoAnnotation(false);
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
      <FormControlLabel label='Rien à labelliser' control={<Checkbox value={noAnnotation} checked={noAnnotation} onClick={() => setNoAnnotation(e => !e)} />} />
    </Stack>
  );
};
