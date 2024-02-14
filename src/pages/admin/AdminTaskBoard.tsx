import { AnnotationBatch, Job, Task } from '@bpartners-annotator/typescript-client';
import { Box, CircularProgress, Grid, List, ListSubheader, MenuItem, Stack, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { CancelEvaluationButton, EvaluationRejectionButton, ValidateButton } from '../../common/components/admin';
import { Canvas } from '../../common/components/canvas';
import { Sidebar } from '../../common/components/sidebar';
import { CanvasAnnotationProvider } from '../../common/context';
import { EvaluationCommentProvider } from '../../common/context/admin';
import { useFetch } from '../../common/hooks';
import { cache, dateFormater, getTaskToValidate, retryer, urlParamsHandler } from '../../common/utils';
import { EMPTY_ANNOTATIONS_TO_VALIDATE, tasksProvider } from '../../providers';
import { annotationsProvider } from '../../providers/admin/annotations-provider';
import { canvas_loading } from '../style';
import { useSnackbar } from 'notistack';
import debounce from 'debounce';
import { palette } from '../../common/utils/theme';

type AdminTaskJobLoaderReturn = {
    batchs: AnnotationBatch[];
    task: Task;
    job: Job;
    tasks: Task[];
};

export const AdminTaskBoard = () => {
    const { task, tasks, batchs, job } = useLoaderData() as AdminTaskJobLoaderReturn;
    const [batch, setBatch] = useState(batchs[0] || {});
    const params = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const notify = useMemo(
        () =>
            debounce(
                () =>
                    enqueueSnackbar("Il n'y a pas encore d'annotation à valider dans ce job.", {
                        style: { background: palette().info.dark },
                    }),
                100
            ),
        [enqueueSnackbar]
    );

    useEffect(() => {
        if (task === null) {
            navigate(`/jobs?${EMPTY_ANNOTATIONS_TO_VALIDATE}=true`);
            notify();
        } else {
            const { setParam } = urlParamsHandler({ taskId: task?.id || '' });
            setParam('taskId', task.id || '');
        }
    }, [task, navigate, notify]);

    const fetcher = async () => {
        cache.deleteCurrentTask();
        const { setParam } = urlParamsHandler();
        const tasks = (await retryer(tasksProvider.getList(params?.jobId || ''))) || [];
        const task = getTaskToValidate(tasks);
        if (task === null) {
            navigate(`/jobs`);
        }
        const batchs = (await retryer(annotationsProvider.getBatchs(params?.jobId || '', task?.id || ''))) || [];
        setParam('taskId', task?.id || '');
        setBatch(batchs[0] || {});
        return task;
    };

    const {
        data: currenTask,
        isLoading,
        fetcher: changeCurrentTask,
    } = useFetch({ fetcher, defaultData: task, onlyOnMutate: true });

    return currenTask !== null && !isLoading ? (
        <EvaluationCommentProvider>
            <CanvasAnnotationProvider
                changeCurrentTask={changeCurrentTask}
                tasks={tasks}
                batch={batch}
                img={currenTask.imageUri || ''}
                labels={job?.labels || []}
            >
                <Grid container height='94%' pl={1}>
                    <Grid
                        container
                        item
                        xs={10}
                        display='flex'
                        direction='column'
                        justifyContent='center'
                        alignItems='center'
                    >
                        <div>{job && <Canvas isLoading={false} job={job} />}</div>
                        <Stack justifyContent='space-between' direction='row' width='70vh' mt={1}>
                            <EvaluationRejectionButton />
                            <ValidateButton />
                        </Stack>
                    </Grid>
                    <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} item xs={2}>
                        <Stack flexGrow={2}>
                            <List subheader={<ListSubheader>Versions de l'annotation</ListSubheader>}>
                                <Stack pt={2} pb={3} px={2}>
                                    <TextField
                                        select
                                        value={dateFormater(batch.creationDatetime)}
                                        size='small'
                                        fullWidth
                                    >
                                        {batchs.map(batch => {
                                            const date = dateFormater(batch.creationDatetime);
                                            return (
                                                <MenuItem onClick={() => setBatch(batch)} key={date} value={date}>
                                                    {date}
                                                </MenuItem>
                                            );
                                        })}
                                    </TextField>
                                </Stack>
                            </List>
                            <Sidebar />
                        </Stack>
                        <Stack spacing={1} m={2} mb={1}>
                            <CancelEvaluationButton />
                        </Stack>
                    </Grid>
                </Grid>
            </CanvasAnnotationProvider>
        </EvaluationCommentProvider>
    ) : (
        <Box sx={canvas_loading}>
            <CircularProgress />
        </Box>
    );
};
