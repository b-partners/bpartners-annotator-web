/* eslint-disable react-hooks/exhaustive-deps */
import { Job, Task } from '@bpartners-annotator/typescript-client';
import { CopyAll as CopyAllIcon } from '@mui/icons-material';
import { Box, Chip, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FC, useEffect, useMemo, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';
import { CANVAS_CONTAINER, CanvasAction, EventHandler, MousePosition } from '.';
import { CanvasEditorProvider, IPolygon, useCanvasAnnotationContext } from '../../context';
import { useCanvasScale, useCanvasSize, useImageCreation, useImageOffset, useSession } from '../../hooks';
import { CanvasHandler, getColorFromMain } from '../../utils';
import { palette } from '../../utils/theme';
import './style.css';

export const Canvas: FC<{ isLoading: boolean; job: Job }> = ({ isLoading, job }) => {
    const { annotations, isAnnotating, setIsAnnotating, addAnnotation, img } = useCanvasAnnotationContext();
    const canvas = useRef<HTMLCanvasElement>(null);
    const canvasImage = useRef<HTMLCanvasElement>(null);
    const canvasCursor = useRef<HTMLCanvasElement>(null);
    const canvasContainer = useRef<HTMLDivElement>(null);
    const { image } = useImageCreation(img);
    const { ch, cw } = useCanvasSize(image);
    const { scaling, centerContent, ...zoomActions } = useCanvasScale(canvasContainer, image);
    const { task } = useLoaderData() as { task: Task };
    const { enqueueSnackbar } = useSnackbar();

    const canvasHandler = useMemo(
        () => new CanvasHandler(canvas, canvasImage, canvasCursor, image),
        [image, canvas, canvasImage, canvasCursor]
    );
    const imageOffset = useImageOffset(canvas, image);

    const { isAdmin } = useSession();

    useEffect(() => {
        canvasHandler.init();
        canvasHandler.draw(annotations.filter(a => !a.isInvisible).map(annotation => annotation.polygon));
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
                isAdmin: isAdmin(),
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

    const getScaledCh = () => {
        const scaled = ch * scaling;
        const containerH = window.innerHeight * 0.8;
        if (scaled < containerH) return containerH;
        return scaled * 1.2;
    };

    const getScaledCw = () => {
        const scaled = cw * scaling;
        const containerW = window.innerWidth * 0.7;
        if (scaled < containerW) return containerW;
        return scaled * 1.2;
    };

    const handleCopyToClipBoard = () => {
        navigator.clipboard.writeText(task.filename || '').then(() => {
            enqueueSnackbar("Le nom de l'image a été copié.", { style: { background: palette().success.main } });
        });
    };

    return (
        <CanvasEditorProvider zoom={zoomActions}>
            <Stack width='70vw' direction='row' marginBottom={1} justifyContent='space-between' alignItems='center'>
                {canvas.current && <MousePosition image={image} canvas={canvasCursor.current} />}
                <Stack flexGrow={2} justifyContent='center' alignItems='center'>
                    <Stack
                        justifyContent='center'
                        alignItems='center'
                        direction='row'
                        bgcolor='rgba(0,0,0,0.1)'
                        px={1}
                        borderRadius={1}
                    >
                        <Typography>{task.filename}</Typography>
                        <IconButton onClick={handleCopyToClipBoard}>
                            <CopyAllIcon />
                        </IconButton>
                    </Stack>
                </Stack>
                <CanvasAction />
            </Stack>
            <Box ref={canvasContainer} sx={CANVAS_CONTAINER}>
                <Box sx={{ height: getScaledCh(), width: getScaledCw() }}>
                    <canvas data-cy='canvas-for-image' ref={canvasImage} height={getScaledCh()} width={getScaledCw()} />
                    <canvas data-cy='canvas-for-polygone' ref={canvas} height={getScaledCh()} width={getScaledCw()} />
                    <canvas
                        data-cy='canvas-for-cursor'
                        ref={canvasCursor}
                        height={getScaledCh()}
                        width={getScaledCw()}
                    />
                    {(isLoading || (image.src.length === 0 && imageOffset.iho === 0)) && (
                        <div
                            className='circular-progress-container'
                            style={{ height: getScaledCh(), width: getScaledCw() }}
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
