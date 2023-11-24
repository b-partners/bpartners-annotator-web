import { Box, Button, CircularProgress, Grid, Stack } from '@mui/material';
import { Annotation, Job, Label, Task, TaskStatus, Whoami } from 'bpartners-annotator-Ts-client';
import { FC, useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { BpButton } from '../common/components/basics';
import { Canvas } from '../common/components/canvas';
import { Sidebar } from '../common/components/sidebar';
import { CanvasAnnotationProvider, IAnnotation, useCanvasAnnotationContext } from '../common/context';
import { useFetch } from '../common/hooks';
import { cache, retryer } from '../common/utils';
import { teamJobsProvider, userTasksProvider } from '../providers';

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

const ConfirmButton: FC<IConfirmButton> = ({ label, onEnd, task, isFetcherLoading }) => {
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

const CancelButton = () => {
  const { setAnnotations } = useCanvasAnnotationContext();
  const cancel = () => setAnnotations([]);
  return <Button onClick={cancel}>Annuler</Button>;
};

const ChangeImageButton: FC<{ fetcher: () => void; task: Task }> = ({ fetcher, task }) => {
  const { setAnnotations } = useCanvasAnnotationContext();
  const { teamId, jobId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const cancelAnnotation = async () => {
    await retryer(async () => await userTasksProvider.updateOne(teamId || '', jobId || '', task.id || '', { ...task, status: TaskStatus.PENDING }));
  };

  const changeImage = () => {
    setIsLoading(true);
    cancelAnnotation()
      .then(() => {
        setAnnotations([]);
        fetcher();
      })
      .finally(() => setIsLoading(false));
  };

  return <BpButton isLoading={isLoading} onClick={changeImage} label="Changer d'image" />;
};

interface UseJobTaskState {
  task: Task | null;
  job: Job | null;
}

export const TaskBoard = () => {
  const { task: taskLoaded, job: jobLoaded } = useLoaderData() as { task: Task; job: Job };
  const [{ job, task }, setState] = useState<UseJobTaskState>({ job: jobLoaded, task: taskLoaded });
  const params = useParams();
  const { data, fetcher, isLoading } = useFetch(
    async () =>
      await Promise.all([userTasksProvider.getOne(params.jobId || '', params.teamId || ''), teamJobsProvider.getOne(params.teamId || '', params.jobId || '')])
  );

  useEffect(() => {
    if (data) {
      setState({ job: data[1], task: data[0] });
    }
    return () => {};
  }, [data]);

  return task !== null ? (
    <CanvasAnnotationProvider img={task.imageUri || ''} labels={job?.labels || []}>
      <Grid container height='94%' pl={1}>
        <Grid item xs={10} display='flex' justifyContent='center' alignItems='center'>
          <div>{job && <Canvas isLoading={isLoading} job={job} />}</div>
        </Grid>
        <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} item xs={2}>
          <Stack flexGrow={2}>
            <Sidebar />
          </Stack>
          <Stack spacing={1} m={2} mb={1}>
            <CancelButton />
            <ChangeImageButton fetcher={fetcher} task={task} />
            <ConfirmButton isFetcherLoading={isLoading} task={task} onEnd={fetcher} label={job?.labels || []} />
          </Stack>
        </Grid>
      </Grid>
    </CanvasAnnotationProvider>
  ) : (
    <Box sx={{ width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
    </Box>
  );
};
