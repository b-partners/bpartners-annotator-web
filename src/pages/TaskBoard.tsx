/* eslint-disable react-hooks/exhaustive-deps */
import { AnnotatorCanvas } from '@bpartners/annotator-component';
import { Box, CircularProgress, Grid, List, ListSubheader, MenuItem, Stack, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { TaskReviewComment } from '../common/components/job&task';
import { Sidebar } from '../common/components/sidebar';
import {
    CancelAnnotationButton,
    ConfirmAnnotationButton,
    NextAnnotationButton,
    ZoomButtons,
} from '../common/components/task-board';
import { CanvasAnnotationProvider } from '../common/context';
import { useGetPrevRoute, usePolygonAnnotationState, useSession, useTaskBoardState } from '../common/hooks';
import { cache, dateFormater, isEmpty } from '../common/utils';
import { UserTaskLoader } from '../router/loaders';
import { canvas_loading } from './style';

export const TaskBoard = () => {
    const {
        polygons,
        setPolygons,
        annotations,
        setAnnotations,
        annotationBatchs,
        annotationBatch,
        setBatchAnnotation,
    } = usePolygonAnnotationState();

    const dataLoaded = useLoaderData() as UserTaskLoader;
    const { annotationsReviews, changeState, globalReviews, isLoading, job, task } = useTaskBoardState(dataLoaded);

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
            img={task.imageUri || ''}
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
                                image={task.imageUri || ''}
                                setPolygons={setPolygons}
                                polygonList={polygons}
                            />
                        )}
                    </div>
                </Grid>
                <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} item xs={2}>
                    <Stack flexGrow={2}>
                        {!!annotationBatch && (
                            <List subheader={<ListSubheader>Versions de l'annotation</ListSubheader>}>
                                <Stack pt={2} pb={3} px={2}>
                                    <TextField
                                        select
                                        value={dateFormater(annotationBatch.creationDatetime)}
                                        size='small'
                                        fullWidth
                                    >
                                        {annotationBatchs.map(batch => {
                                            const date = dateFormater(batch.creationDatetime);
                                            return (
                                                <MenuItem
                                                    onClick={() => setBatchAnnotation(batch)}
                                                    key={date}
                                                    value={date}
                                                >
                                                    {date}
                                                </MenuItem>
                                            );
                                        })}
                                    </TextField>
                                </Stack>
                            </List>
                        )}
                        <Sidebar />
                    </Stack>
                    <Stack spacing={1} m={2} mb={1}>
                        <CancelAnnotationButton />
                        <NextAnnotationButton fetcher={changeState} task={task} />
                        <ConfirmAnnotationButton
                            isFetcherLoading={isLoading}
                            task={task}
                            onEnd={changeState}
                            labels={job?.labels || []}
                        />
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
