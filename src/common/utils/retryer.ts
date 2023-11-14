import { AxiosError } from 'axios';

type Fetcher<T> = () => Promise<T>;

export const retryer = async <T>(fetcher: Fetcher<T>) => {
  let retryCount = 0;

  const retry = async (): Promise<T | null> => {
    try {
      const data = await fetcher();
      retryCount = 0;
      return data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.status === '403' || error.status === '401' || retryCount === 2) {
        retryCount = 0;
        throw error;
      }
      retryCount++;
      return await retry();
    }
  };

  return retry();
};
