import { Stack, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { getMousePositionInCanvas } from '.';
import { getCanvasImageOffset } from '../../utils';

interface IPositionProps {
  label: string;
  value: number;
}
interface IMousePositionProps {
  canvas: HTMLCanvasElement | null;
  image: HTMLImageElement;
}

const Position: FC<IPositionProps> = ({ label, value }) => {
  return (
    <Stack direction='row' py={0.3} width={100} px={1} spacing={1}>
      <Typography color='text.secondary'>{label} :</Typography>
      <Typography>{value}</Typography>
    </Stack>
  );
};

const notNegative = (value: number) => (value < 0 ? 0 : value);

export const MousePosition: FC<IMousePositionProps> = ({ canvas, image }) => {
  const [{ x, y }, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (canvas && image) {
      const { iho, iwo } = getCanvasImageOffset(canvas, image);
      const eventListener = (event: MouseEvent) => {
        const { x: mx, y: my } = getMousePositionInCanvas(event, canvas);
        const pos = { x: 0, y: 0 };

        if (mx > image.width + iwo) {
          pos.x = image.width + iwo;
        } else if (mx >= iwo) {
          pos.x = notNegative(mx - iwo);
        }

        if (my > image.height + iho) {
          pos.y = image.height + iho;
        } else if (my >= iho) {
          pos.y = notNegative(my - iho);
        }

        setMousePosition(pos);
      };

      canvas.addEventListener('mousemove', eventListener);
      return () => {
        canvas.removeEventListener('mousemove', eventListener);
      };
    }
  }, [canvas, image]);

  return (
    <>
      <Position label='x' value={x} />
      <Position label='y' value={y} />
    </>
  );
};
