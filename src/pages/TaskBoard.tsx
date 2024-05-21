/* eslint-disable react-hooks/exhaustive-deps */
import { AnnotatorCanvas } from '@bpartners/annotator-component';
import { Box, CircularProgress, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TaskReviewComment } from '../common/components/job&task';
import { Sidebar } from '../common/components/sidebar';
import {
    CancelAnnotationButton,
    ConfirmAnnotationButton,
    NextAnnotationButton,
    ZoomButtons,
} from '../common/components/task-board';
import { CanvasAnnotationProvider } from '../common/context';
import { useTaskBoardFetcher } from '../common/fetchers';
import { useGetAnnotationReviews, useGetPrevRoute, usePolygonAnnotationState, useSession } from '../common/hooks';
import { cache, dateFormater, isEmpty } from '../common/utils';
import { canvas_loading } from './style';

export const TaskBoard = () => {
    const {
        polygons,
        setPolygons,
        annotations,
        setAnnotations,
        annotationBatch,
        setBatchAnnotation,
        annotationBatchs,
        setBatchAnnotations,
    } = usePolygonAnnotationState();

    const { changeState, isLoading, job, task, annotationBatchs: fetchedAnnotationBatchs } = useTaskBoardFetcher();
    const {
        annotationReviews: { annotationsReviews, globalReviews },
        fetchAnnotationReviews,
    } = useGetAnnotationReviews();

    useEffect(() => {
        setBatchAnnotations(fetchedAnnotationBatchs || []);
    }, [fetchedAnnotationBatchs]);

    useEffect(() => {
        if (annotationBatch?.id && task?.id)
            fetchAnnotationReviews({ annotationBatchId: annotationBatch?.id, taskId: task.id });
    }, [annotationBatch, annotationBatchs]);

    const params = useParams();
    const navigate = useNavigate();
    const prevRoute = useGetPrevRoute(1);

    useEffect(() => {
        if (!task) {
            navigate(`/teams/${params.teamId}/jobs`);
        }
    }, []);

    useEffect(() => {
        if (isEmpty(task || {})) {
            cache.deleteCurrentTask();
            navigate(prevRoute());
            return () => {};
        }
    }, [task]);

    const { isUser } = useSession();

    return task !== null ? (
        <CanvasAnnotationProvider
            annotations={annotations}
            setAnnotations={setAnnotations}
            img={task?.imageUri || ''}
            batch={annotationBatch || undefined}
            annotationsReviews={annotationsReviews || undefined}
            globalReviews={globalReviews || undefined}
            labels={job?.labels || []}
        >
            <TaskReviewComment />
            <Grid container height='94%' pl={1}>
                <Grid item xs={10} display='flex' justifyContent='center' alignItems='flex-start'>
                    <div>
                        {job && (
                            <AnnotatorCanvas
                                buttonsComponent={ZoomButtons}
                                allowAnnotation={isUser()}
                                height='70vh'
                                width='70vw'
                                image={task?.imageUri || ''}
                                setPolygons={setPolygons}
                                polygonList={polygons}
                            />
                        )}
                    </div>
                </Grid>
                <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} item xs={2}>
                    <Stack flexGrow={2}>
                        {!!annotationBatch && (
                            <TextField
                                select
                                label="Versions de l'annotation"
                                value={dateFormater(annotationBatch.creationDatetime)}
                                size='small'
                                sx={{ mt: 2 }}
                                fullWidth
                            >
                                {annotationBatchs?.map(batch => {
                                    const date = dateFormater(batch.creationDatetime);
                                    return (
                                        <MenuItem onClick={() => setBatchAnnotation(batch)} key={date} value={date}>
                                            {date}
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        )}
                        <Sidebar />
                    </Stack>
                    <Stack spacing={1} m={2} mb={1}>
                        <CancelAnnotationButton />
                        {task && (
                            <>
                                <NextAnnotationButton fetcher={changeState} task={task} />
                                <ConfirmAnnotationButton
                                    isFetcherLoading={isLoading}
                                    task={task}
                                    onEnd={changeState}
                                    labels={job?.labels || []}
                                />
                            </>
                        )}
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
