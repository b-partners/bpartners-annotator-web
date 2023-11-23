import { Box, Button, CircularProgress, Grid, Stack } from '@mui/material';
import { Annotation, Job, Label, TaskStatus, UserTask, Whoami } from 'bpartners-annotator-Ts-client';
import { FC, useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { BpButton } from '../common/components/basics';
import { Canvas } from '../common/components/canvas';
import { Sidebar } from '../common/components/sidebar';
import { CanvasAnnotationProvider, useCanvasAnnotationContext } from '../common/context';
import { useFetch } from '../common/hooks';
import { cache, retryer } from '../common/utils';
import { userTasksProvider } from '../providers';

interface IConfirmButton {
  task: UserTask;
  label: Label[];
  onEnd: () => void;
}

const ConfirmButton: FC<IConfirmButton> = ({ label, onEnd, task }) => {
  const { annotations, setAnnotations } = useCanvasAnnotationContext();
  const [isLoading, setLoading] = useState(false);
  const params = useParams();

  const handleClick = () => {
    const whoami = cache.getWhoami() as Whoami;
    const userId = whoami.user?.id || '';
    const taskAnnotation: Annotation[] = annotations.map(annotation => ({
      id: uuidV4(),
      label: label.find(e => e.name === annotation.label),
      taskId: task.id || '',
      polygon: { points: annotation.polygon.points },
      userId,
    }));
    onEnd();
    Promise.allSettled([
      userTasksProvider.annotateOne(userId, task.id || '', taskAnnotation),
      userTasksProvider.updateOne(params.teamId || '', params.jobId || '', task.id || '', { ...task, status: TaskStatus.COMPLETED }),
    ])
      .then(() => {
        const { jobId, teamId } = params as Record<string, string>;
        setAnnotations([]);
        window.location.replace(`/teams/${teamId}/jobs/${jobId}`);
      })
      .catch(err => {
        alert((err as Error).message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Button onClick={handleClick} disabled={annotations.length === 0 || isLoading}>
      Valider l'annotation
    </Button>
  );
};

const CancelButton = () => {
  const { setAnnotations } = useCanvasAnnotationContext();
  const cancel = () => setAnnotations([]);
  return <Button onClick={cancel}>Annuler</Button>;
};

const ChangeImageButton: FC<{ fetcher: () => void; task: UserTask }> = ({ fetcher, task }) => {
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

export const TaskBoard = () => {
  const { task: taskLoaded, job } = useLoaderData() as { task: UserTask; job: Job };
  const [task, setTask] = useState<UserTask | null>(taskLoaded);
  const params = useParams();
  const { data, fetcher, isLoading } = useFetch(async () => await userTasksProvider.getOne(params.jobId || '', params.teamId || ''));

  useEffect(() => {
    setTask({ ...data });
    return () => {};
  }, [data]);

  return task !== null ? (
    <CanvasAnnotationProvider img={task.imageUri || ''} labels={job.labels || []}>
      <Grid container height='94%' pl={1}>
        <Grid item xs={10} display='flex' justifyContent='center' alignItems='center'>
          <div>
            <Canvas isLoading={isLoading} />
          </div>
        </Grid>
        <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} item xs={2}>
          <Stack flexGrow={2}>
            <Sidebar />
          </Stack>
          <Stack spacing={1} m={2} mb={1}>
            <CancelButton />
            <ChangeImageButton fetcher={fetcher} task={task} />
            <ConfirmButton task={task} onEnd={fetcher} label={job?.labels || []} />
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
