import { RefObject, useMemo } from 'react';

export const useImageOffset = (canvas: RefObject<HTMLCanvasElement>, image: HTMLImageElement) => {
    const iwo = useMemo(() => Math.floor((canvas.current?.width || 0) - image.width) / 2, [canvas, image]);
    const iho = useMemo(() => Math.floor((canvas.current?.height || 0) - image.height) / 2, [canvas, image]);
    return { iwo, iho };
};
