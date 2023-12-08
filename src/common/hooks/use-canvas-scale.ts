import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';

const INITIAL_SCALE = 4;
const SCALE_NUMBER = 0.1;

export const useCanvasScale = (container: RefObject<HTMLDivElement>) => {
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

  const zoomIn = () => {
    if (scaling < MAX_SCALE) {
      setScale(e => e + SCALE_NUMBER);
    }
    centerContent();
  };
  const zoomOut = () => {
    if (scaling > 1) {
      setScale(e => e - SCALE_NUMBER);
    }
    centerContent();
  };

  const resetZoom = () => {
    setScale(defaultScale);
    centerContent();
  };
  const setDefaultScaling = (newScale: number) => setDefaultScale(newScale);

  return { zoomIn, zoomOut, scaling, resetZoom, setDefaultScaling };
};
