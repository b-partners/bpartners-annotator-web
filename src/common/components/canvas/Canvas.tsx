/* eslint-disable react-hooks/exhaustive-deps */
import { Job } from '@bpartners-annotator/typescript-client';
import { Box, Chip, CircularProgress, Grid, Stack } from '@mui/material';
import { FC, useEffect, useMemo, useRef } from 'react';
import { CANVAS_CONTAINER, CanvasAction, EventHandler, MousePosition } from '.';
import { CanvasEditorProvider, IPolygon, useCanvasAnnotationContext } from '../../context';
import { useCanvasScale, useCanvasSize, useImageCreation, useImageOffset, useSession } from '../../hooks';
import { CanvasHandler, getColorFromMain } from '../../utils';
import './style.css';

export const Canvas: FC<{ isLoading: boolean; job: Job }> = ({ isLoading, job }) => {
    const { annotations, isAnnotating, setIsAnnotating, addAnnotation, img } = useCanvasAnnotationContext();
    const canvas = useRef<HTMLCanvasElement>(null);
    const canvasImage = useRef<HTMLCanvasElement>(null);
    const canvasCursor = useRef<HTMLCanvasElement>(null);
    const canvasContainer = useRef<HTMLDivElement>(null);
    const { image } = useImageCreation(img);
    const { scaling, centerContent, ...zoomActions } = useCanvasScale(canvasContainer, image);
    const { ch, cw } = useCanvasSize();
    const canvasHandler = useMemo(
        () => new CanvasHandler(canvas, canvasImage, canvasCursor, image),
        [image, canvas, canvasImage, canvasCursor]
    );
    const imageOffset = useImageOffset(canvas, image);

    useEffect(() => {
        canvasHandler.init();
        canvasHandler.draw(annotations.map(annotation => annotation.polygon));
        if (window && canvas.current && canvasCursor.current && isAnnotating !== undefined) {
            const currentCanvas = canvas.current;
            const currentCanvasCursor = canvasCursor.current;
            const polygon: IPolygon = { ...getColorFromMain('#00ff00'), points: [] };
            const eventHandler = new EventHandler({
                annotations,
                canvas: currentCanvas,
                image,
                canvasHandler,
                imageOffset,
                isAnnotating,
                polygon,
            });
            return eventHandler.initEvent(currentCanvasCursor, addAnnotation);
        }
    }, [isAnnotating, annotations, image, imageOffset, isLoading]);

    useEffect(() => {
        setIsAnnotating(false);
    }, [annotations]);

    useEffect(() => {
        centerContent();
    }, [scaling]);

    const { isAdmin } = useSession();

    return (
        <CanvasEditorProvider zoom={zoomActions}>
            <Grid container p={0.3} width='70vw' direction='row' spacing={1}>
                <Grid container item xs={10} direction='row' flexGrow={2} spacing={1}>
                    <Stack direction='row'>
                        {canvas.current && <MousePosition image={image} canvas={canvasCursor.current} />}
                    </Stack>
                </Grid>
                <Grid container item sx={{ textAlign: 'end' }} xs={2}>
                    <CanvasAction />
                </Grid>
            </Grid>
            <Box ref={canvasContainer} sx={CANVAS_CONTAINER}>
                <Box sx={{ height: ch * scaling, width: cw * scaling }}>
                    <canvas ref={canvasImage} height={ch * scaling} width={cw * scaling} />
                    <canvas ref={canvas} height={ch * scaling} width={cw * scaling} />
                    <canvas ref={canvasCursor} height={ch * scaling} width={cw * scaling} />
                    {(isLoading || (image.src.length === 0 && imageOffset.iho === 0)) && (
                        <div
                            className='circular-progress-container'
                            style={{ height: ch * scaling, width: cw * scaling }}
                        >
                            <CircularProgress size='3rem' />
                        </div>
                    )}
                </Box>
            </Box>
            {isAdmin() && (
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
            )}
        </CanvasEditorProvider>
    );
};
