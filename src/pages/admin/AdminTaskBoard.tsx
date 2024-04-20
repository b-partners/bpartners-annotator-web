import { AnnotationBatch, Job, Task } from '@bpartners-annotator/typescript-client';
import { Box, CircularProgress, Grid, List, ListSubheader, MenuItem, Stack, TextField } from '@mui/material';
import { AnnotatorCanvas, Polygon } from '@bpartners/annotator-component';
import { CopyAll as CopyAllIcon } from '@mui/icons-material';
import { IconButton, Typography, Chip } from '@mui/material';
import debounce from 'debounce';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { CancelEvaluationButton, EvaluationRejectionButton, ValidateButton } from '../../common/components/admin';
import { Sidebar } from '../../common/components/sidebar';
import { CanvasAnnotationProvider, IAnnotation } from '../../common/context';
import { EvaluationCommentProvider } from '../../common/context/admin';
import { useFetch, useSession } from '../../common/hooks';
import { PolygonAnnotationMapper, annotationsMapper } from '../../common/mappers';
import { cache, dateFormater, getTaskToValidate, retryer, urlParamsHandler } from '../../common/utils';
import { palette } from '../../common/utils/theme';
import { EMPTY_ANNOTATIONS_TO_VALIDATE, tasksProvider } from '../../providers';
import { annotationsProvider } from '../../providers/admin/annotations-provider';
import { canvas_loading } from '../style';
import { CANVAS_CONTAINER, GRID_ITEM_CONTAINER, GRID_ITEM_SIDEBAR_CONTAINER, IMAGE_NAME_COPY } from './styles';
import { ZoomButtons } from '../../common/components/task-board';

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
    const { isUser } = useSession();
    const [annotations, setAnnotations] = useState<IAnnotation[]>([]);
    useEffect(() => {
        const annotation = batch?.annotations?.map((annotation, key) =>
            annotationsMapper.toDomain(annotation, key + 1)
        );
        setAnnotations(annotation || []);
    }, [batch]);

    const setPolygons = (polygons: Polygon[]) => {
        setAnnotations(prev => PolygonAnnotationMapper.polygonsToAnnotations(prev, polygons));
    };

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

    const handleCopyToClipBoard = () => {
        navigator.clipboard.writeText(task.filename || '').then(() => {
            enqueueSnackbar("Le nom de l'image a été copié.", { style: { background: palette().success.main } });
        });
    };

    return currenTask !== null && !isLoading ? (
        <EvaluationCommentProvider>
            <CanvasAnnotationProvider
                changeCurrentTask={changeCurrentTask}
                tasks={tasks}
                batch={batch}
                img={currenTask.imageUri || ''}
                labels={job?.labels || []}
                annotations={annotations}
                setAnnotations={setAnnotations}
            >
                <Grid container height='94%' pl={1}>
                    <Grid container item sx={GRID_ITEM_CONTAINER} xs={10}>
                        <div style={CANVAS_CONTAINER}>
                            {job && (
                                <AnnotatorCanvas
                                    buttonsComponent={ZoomButtons}
                                    allowAnnotation={isUser()}
                                    height='70vh'
                                    width='70vw'
                                    image={(currenTask || task).imageUri || ''}
                                    setPolygons={setPolygons}
                                    polygonList={annotations.map(PolygonAnnotationMapper.annotationToPolygon)}
                                />
                            )}
                        </div>
                        <Stack p={0.3} width='70vw' direction='row' spacing={1}>
                            <Stack direction='row' flexGrow={2} spacing={1}>
                                <Chip
                                    color='info'
                                    label={`Taches restantes: ${job.taskStatistics?.remainingTasks} / ${job.taskStatistics?.totalTasks}`}
                                    size='small'
                                    variant='outlined'
                                />
                                <Chip
                                    color='success'
                                    label={`Taches accomplies par l'utilisateur: ${job.taskStatistics?.completedTasksByUserId}`}
                                    size='small'
                                    variant='outlined'
                                />
                            </Stack>
                        </Stack>
                        <Stack justifyContent='space-between' direction='row' width='70vh' mt={1}>
                            <EvaluationRejectionButton />
                            <ValidateButton />
                        </Stack>
                        <Stack direction='row' sx={IMAGE_NAME_COPY}>
                            <Typography>{task.filename}</Typography>
                            <IconButton onClick={handleCopyToClipBoard}>
                                <CopyAllIcon />
                            </IconButton>
                        </Stack>
                    </Grid>
                    <Grid sx={GRID_ITEM_SIDEBAR_CONTAINER} item xs={2}>
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
