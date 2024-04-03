/* eslint-disable react-hooks/exhaustive-deps */
import { AnnotatorCanvas, Polygon } from '@bpartners/annotator-component';
import { Box, CircularProgress, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { TaskReviewComment } from '../common/components/job&task';
import { Sidebar } from '../common/components/sidebar';
import { CancelAnnotationButton, ConfirmAnnotationButton, NextAnnotationButton, ZoomButtons } from '../common/components/task-board';
import { CanvasAnnotationProvider, IAnnotation } from '../common/context';
import { useGetPrevRoute, useSession, useTaskBoardState } from '../common/hooks';
import { PolygonAnnotationMapper, annotationsMapper } from '../common/mappers';
import { cache, isEmpty } from '../common/utils';
import { UserTaskLoader } from '../router/loaders';
import { canvas_loading } from './style';

export const TaskBoard = () => {
    const dataLoaded = useLoaderData() as UserTaskLoader;
    const { annotationBatch, annotationsReviews, changeState, globalReviews, isLoading, job, task } =
        useTaskBoardState(dataLoaded);

    const [annotations, setAnnotations] = useState<IAnnotation[]>([]);
    useEffect(() => {
        const annotation = annotationBatch?.annotations?.map((annotation, key) =>
            annotationsMapper.toDomain(annotation, key + 1)
        );
        setAnnotations(annotation || []);
    }, [annotationBatch]);

    const setPolygons = (polygons: Polygon[]) => {
        setAnnotations(prev => PolygonAnnotationMapper.polygonsToAnnotations(prev, polygons));
    };

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
                <Grid item xs={10} display='flex' justifyContent='center' alignItems='center'>
                    <div>
                        {job && (
                            <AnnotatorCanvas
                                buttonsComponent={ZoomButtons}
                                allowAnnotation={isUser()}
                                height='80vh'
                                width='70vw'
                                image={task.imageUri || ''}
                                setPolygons={setPolygons}
                                polygonList={annotations.map(PolygonAnnotationMapper.annotationToPolygon)}
                            />
                        )}
                    </div>
                </Grid>
                <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} item xs={2}>
                    <Stack flexGrow={2}>
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
