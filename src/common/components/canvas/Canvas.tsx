/* eslint-disable react-hooks/exhaustive-deps */
import { Box, CircularProgress, Stack } from '@mui/material';
import { FC, useEffect, useMemo, useRef } from 'react';
import { CANVAS_CONTAINER, CanvasAction, EventHandler, MousePosition } from '.';
import { CanvasEditorProvider, IPolygon, useCanvasAnnotationContext } from '../../context';
import { useCanvasScale, useCanvasSize, useImageCreation, useImageOffset } from '../../hooks';
import { CanvasHandler, getColorFromMain } from '../../utils';
import './style.css';

export const Canvas: FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const { annotations, isAnnotating, setIsAnnotating, addAnnotation, img } = useCanvasAnnotationContext();
  const canvas = useRef<HTMLCanvasElement>(null);
  const canvasImage = useRef<HTMLCanvasElement>(null);
  const canvasCursor = useRef<HTMLCanvasElement>(null);
  const canvasContainer = useRef<HTMLDivElement>(null);
  const { image } = useImageCreation(img);
  const { scaling, setDefaultScaling, ...zoomActions } = useCanvasScale(canvasContainer);
  const { ch, cw } = useCanvasSize();
  const canvasHandler = useMemo(() => new CanvasHandler(canvas, canvasImage, canvasCursor, image), [image, canvas, canvasImage, canvasCursor]);
  const imageOffset = useImageOffset(canvas, image);

  useEffect(() => {
    canvasHandler.init();
    canvasHandler.draw(annotations.map(annotation => annotation.polygon));
    if (window && canvas.current && canvasCursor.current && isAnnotating !== undefined) {
      const currentCanvas = canvas.current;
      const currentCanvasCursor = canvasCursor.current;
      const polygon: IPolygon = { ...getColorFromMain('#00ff00'), points: [] };
      const eventHandler = new EventHandler({ annotations, canvas: currentCanvas, image, canvasHandler, imageOffset, isAnnotating, polygon });
      return eventHandler.initEvent(currentCanvasCursor, addAnnotation);
    }
  }, [isAnnotating, annotations, image, imageOffset, isLoading]);

  useEffect(() => {
    setIsAnnotating(false);
  }, [annotations]);

  return (
    <CanvasEditorProvider zoom={zoomActions}>
      <Stack p={0.3} width='70vw' direction='row' spacing={1}>
        <Stack direction='row' flexGrow={2} spacing={1}>
          {canvas.current && <MousePosition image={image} canvas={canvasCursor.current} />}
        </Stack>
        <CanvasAction />
      </Stack>
      <Box ref={canvasContainer} sx={CANVAS_CONTAINER}>
        <Box sx={{ height: ch * scaling, width: cw * scaling }}>
          <canvas ref={canvasImage} height={ch} width={cw} style={{ height: ch * scaling, width: cw * scaling }} />
          <canvas ref={canvas} height={ch} width={cw} style={{ height: ch * scaling, width: cw * scaling }} />
          <canvas ref={canvasCursor} height={ch} width={cw} style={{ height: ch * scaling, width: cw * scaling }} />
          {(isLoading || (image.src.length === 0 && imageOffset.iho === 0)) && (
            <div
              style={{
                height: ch,
                width: cw,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                background: 'rgba(0,0,0,0.1)',
              }}
            >
              <CircularProgress size='3rem' />
            </div>
          )}
        </Box>
      </Box>
    </CanvasEditorProvider>
  );
};