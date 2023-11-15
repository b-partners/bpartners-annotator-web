import { Box, Button, CircularProgress, Grid, Stack } from '@mui/material';
import { Annotation, Job, Label, Task } from 'bpartners-annotator-react-client';
import { FC, useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { Canvas } from '../common/components/canvas';
import { Sidebar } from '../common/components/sidebar';
import { CanvasAnnotationProvider, useCanvasAnnotationContext } from '../common/context';
import { cache } from '../common/utils';
import { userTasksProvider } from '../providers';

const USER_ID = '87910ed1-fb39-4a25-a253-50e43639cd8a';

const useRefetchImage = () => {
  const params = useParams();
  const navigate = useNavigate();

  return () => {
    navigate(`/teams/${params.teamId}/jobs/${params.jobId}`);
  };
};

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
    const taskAnnotation: Annotation[] = annotations.map(annotation => ({
      id: uuidV4(),
      label: label.find(e => e.name === annotation.label),
      taskId: taskId,
      polygon: { points: annotation.polygon.points },
      userId: USER_ID,
    }));
    onEnd();
    userTasksProvider
      .annotateOne(USER_ID, taskId, taskAnnotation)
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

export const TaskBoard = () => {
  const { task, job } = useLoaderData() as { task: Task; job: Job };
  const imageFetcher = useRefetchImage();

  return task !== null ? (
    <CanvasAnnotationProvider img={task?.imageURI || ''} labels={job?.labels || []}>
      <Grid container height='94%' pl={1}>
        <Grid item xs={10} display='flex' justifyContent='center' alignItems='center'>
          <div>
            <Canvas />
          </div>
        </Grid>
        <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} item xs={2}>
          <Stack flexGrow={2}>
            <Sidebar />
          </Stack>
          <Stack spacing={1} m={2} mb={1}>
            <CancelButton />
            <Button onClick={imageFetcher}>Changer d'image</Button>
            <ConfirmButton onEnd={imageFetcher} label={job?.labels || []} taskId={task.id || ''} />
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
