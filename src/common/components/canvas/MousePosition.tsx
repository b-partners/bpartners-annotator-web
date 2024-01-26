import { Stack, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { ScalingHandler } from '.';

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
        <Stack data-cy={`mouse-${label}-position`} direction='row' py={0.3} width={100} px={1} spacing={1}>
            <Typography color='text.secondary'>{label} :</Typography>
            <Typography>{value}</Typography>
        </Stack>
    );
};

export const MousePosition: FC<IMousePositionProps> = ({ canvas, image }) => {
    const [{ x, y }, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (canvas && image) {
            const sH = new ScalingHandler(canvas, image);
            const eventListener = (event: MouseEvent) => {
                const pos = sH.getRestrictedPhysicalPositionByEvent(event);
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
