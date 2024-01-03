import { useEffect, useState } from 'react';

export const useWaiter = (timeout: number) => {
    const [time, setTime] = useState(timeout);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(last => (last > 0 ? last - 1 : 0));
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeout]);

    return time;
};
