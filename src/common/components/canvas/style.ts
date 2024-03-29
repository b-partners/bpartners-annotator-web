import { SxProps } from '@mui/material';
import { CSSProperties } from 'react';

export const CANVAS: CSSProperties = { position: 'absolute', top: 0, left: 0, cursor: 'none' };
export const CANVAS_CONTAINER: SxProps = {
    overflow: 'auto',
    position: 'relative',
    background: 'rgba(0,0,0,0.05)',
    '&::-webkit-scrollbar': {
        display: 'none',
    },
    zIndex: 999,
    height: '80vh',
    width: '70vw',
    '& > div > canvas': CANVAS,
    '& .circular-progress-container': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        background: 'rgba(0,0,0,0.1)',
    },
};
