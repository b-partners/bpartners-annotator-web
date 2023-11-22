import { useEffect, useState } from 'react';

export const useWaiter = (timeout: number, onEnd: () => void) => {
  const [time, setTime] = useState(timeout);

  useEffect(() => {
    const intervalId = setInterval(
      () =>
        setTime(last => {
          if (last === 0) {
            onEnd();
            return 0;
          }
          return last - 1;
        }),
      1000
    );
    return () => clearInterval(intervalId);
  }, [timeout, onEnd]);

  return time;
};
