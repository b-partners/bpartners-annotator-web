import { Box, Button, CircularProgress, Grid, Stack } from '@mui/material';
import { Annotation, Job, Label, Task, TaskStatus, Whoami } from 'bpartners-annotator-Ts-client';
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
  taskId: string;
  label: Label[];
  onEnd: () => void;
}

const ConfirmButton: FC<IConfirmButton> = ({ taskId, label, onEnd }) => {
  const { annotations } = useCanvasAnnotationContext();
  const [isLoading, setLoading] = useState(false);
  const params = useParams();

  const handleClick = () => {
    const whoami = cache.getWhoami() as Whoami;
    const userId = whoami.user?.id || '';
    const taskAnnotation: Annotation[] = annotations.map(annotation => ({
      id: uuidV4(),
      label: label.find(e => e.name === annotation.label),
      taskId: taskId,
      polygon: { points: annotation.polygon.points },
      userId,
    }));
    onEnd();
    userTasksProvider
      .annotateOne(userId, taskId, taskAnnotation)
      .then(() => {
        const { jobId, teamId } = params as Record<string, string>;
        cache.deleteCurrentTask();
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

export const TaskBoard = () => {
  const { task: taskLoaded, job } = useLoaderData() as { task: Task; job: Job };
  const [task, setTask] = useState<Task | null>(taskLoaded);
  const params = useParams();
  const { data, fetcher, isLoading } = useFetch(async () => await userTasksProvider.getOne(params.jobId || '', params.teamId || ''));

  useEffect(() => {
    setTask({ ...data });
  }, [data]);

  return task !== null ? (
    <CanvasAnnotationProvider img={task.imageURI || ''} labels={job.labels || []}>
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
            <ConfirmButton onEnd={fetcher} label={job?.labels || []} taskId={task.id || ''} />
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
