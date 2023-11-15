import { RefObject, useMemo, useState } from 'react';

const INITIAL_SCALE = 1;
const SCALE_NUMBER = 0.1;

export const useCanvasScale = (container: RefObject<HTMLDivElement>) => {
  const [defaultScale, setDefaultScale] = useState(INITIAL_SCALE);
  const [scaling, setScale] = useState(defaultScale);
  const MAX_SCALE = useMemo(() => defaultScale + 2, [defaultScale]);

  const centerContent = () => {
    if (container.current) {
      const currentContainer = container.current;
      const middleY = (currentContainer.scrollHeight - currentContainer.clientHeight) / 2;
      const middleX = (currentContainer.scrollWidth - currentContainer.clientWidth) / 2;
      currentContainer.scrollTop = middleY;
      currentContainer.scrollLeft = middleX;
    }
  };

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
  const setDefaultScaling = (newScale: number) => setDefaultScale(newScale);

  return { zoomIn, zoomOut, scaling, resetZoom, setDefaultScaling };
};
