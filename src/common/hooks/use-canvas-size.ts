import { useMemo } from 'react';
import { useWindowSize } from '.';

export const useCanvasSize = () => {
  const { height, width } = useWindowSize();

  const ch = useMemo(() => height * 0.8, [height]);
  const cw = useMemo(() => width * 0.7, [width]);

  return { ch, cw };
};
