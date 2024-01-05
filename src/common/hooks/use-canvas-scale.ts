import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';

const INITIAL_SCALE = 1;
const SCALE_NUMBER = 0.2;

export const useCanvasScale = (container: RefObject<HTMLDivElement>, image: HTMLImageElement) => {
    const [defaultScale, setDefaultScale] = useState(INITIAL_SCALE);
    const [scaling, setScale] = useState(defaultScale);
    const MAX_SCALE = useMemo(() => defaultScale + 2, [defaultScale]);

    const centerContent = useCallback(() => {
        if (container.current) {
            const currentContainer = container.current;
            const middleY = (currentContainer.scrollHeight - currentContainer.clientHeight) / 2;
            const middleX = (currentContainer.scrollWidth - currentContainer.clientWidth) / 2;
            container.current.scrollTo({ left: middleX, top: middleY, behavior: 'auto' });
        }
    }, [container]);

    useEffect(() => {
        centerContent();
    }, [centerContent]);

    useEffect(() => {
        if (!!window) {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('scale', `${scaling}`);
            window.history.replaceState({}, document.title, currentUrl);
            return () => {};
        }
    }, [scaling]);

    useEffect(() => {
        if (image.width !== 0) {
            const newScale =
                image.width < window.innerWidth * 0.7 && image.height < window.innerHeight * 0.8
                    ? (window.innerWidth * 0.15) / image.width
                    : (window.innerHeight * 0.7) / image.height;
            setDefaultScale(newScale);
            setScale(newScale);
        }
    }, [centerContent, image]);

    const zoomIn = () => {
        if (scaling < MAX_SCALE) {
            setScale(e => e + SCALE_NUMBER);
        }
        centerContent();
    };
    const zoomOut = () => {
        if (scaling > defaultScale) {
            setScale(e => e - SCALE_NUMBER);
        }
        centerContent();
    };

    const resetZoom = () => {
        setScale(defaultScale);
        centerContent();
    };
    const setDefaultScaling = (newScale: number) => {
        if (newScale !== Infinity) {
            console.log(newScale);

            setDefaultScale(newScale);
            setScale(newScale);
        }
    };

    return { zoomIn, zoomOut, scaling, resetZoom, setDefaultScaling, centerContent };
};
