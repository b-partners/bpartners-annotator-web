import { useMemo } from 'react';
import { useWindowSize } from '.';

export const useCanvasSize = (image: HTMLImageElement) => {
    const { height, width } = useWindowSize();

    const ch = useMemo(() => {
        const ch = height * 0.8;
        if (ch < image.height) {
            return image.height;
        }
        return ch;
    }, [height, image]);
    const cw = useMemo(() => {
        const cw = width * 0.7;
        if (cw < image.width) {
            return image.width;
        }
        return cw;
    }, [width, image]);

    return { ch, cw };
};
