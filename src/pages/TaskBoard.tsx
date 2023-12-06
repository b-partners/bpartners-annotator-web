/* eslint-disable react-hooks/exhaustive-deps */
import { Job, Task } from '@bpartners-annotator/typescript-client';
import { Box, CircularProgress, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { Canvas } from '../common/components/canvas';
import { Sidebar } from '../common/components/sidebar';
import { CancelAnnotationButton, ConfirmAnnotationButton, NextAnnotationButton } from '../common/components/task-board';
import { CanvasAnnotationProvider } from '../common/context';
import { useFetch, useGetPrevRoute } from '../common/hooks';
import { cache, isEmpty } from '../common/utils';
import { teamJobsProvider, userTasksProvider } from '../providers';
import { canvas_loading } from './style';
import { UseJobTaskState } from './type';

export const TaskBoard = () => {
  const { task: taskLoaded, job: jobLoaded } = useLoaderData() as { task: Task; job: Job };
  const [{ job, task }, setState] = useState<UseJobTaskState>({ job: jobLoaded, task: taskLoaded });
  const params = useParams();
  const { data, fetcher, isLoading } = useFetch(
    async () =>
      await Promise.all([userTasksProvider.getOne(params.jobId || '', params.teamId || ''), teamJobsProvider.getOne(params.teamId || '', params.jobId || '')])
  );
  const prevRoute = useGetPrevRoute(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEmpty(taskLoaded) || (!!data && isEmpty(data[0]))) {
      cache.deleteCurrentTask();
      navigate(prevRoute());
    }

    if (data) setState({ job: data[1], task: data[0] });
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
            <CancelAnnotationButton />
            <NextAnnotationButton fetcher={fetcher} task={task} />
            <ConfirmAnnotationButton isFetcherLoading={isLoading} task={task} onEnd={fetcher} label={job?.labels || []} />
          </Stack>
        </Grid>
      </Grid>
    </CanvasAnnotationProvider>
  ) : (
    <Box sx={canvas_loading}>
      <CircularProgress />
    </Box>
  );
};
