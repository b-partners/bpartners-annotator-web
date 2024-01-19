import { AxiosError } from 'axios';

type Fetcher<T> = () => Promise<T>;

export const retryer = async <T>(fetcher: Fetcher<T> | Promise<T>, options: Record<string, any> = {}) => {
    let retryCount = 0;

    const retry = async (): Promise<T | null> => {
        try {
            const data = await (typeof fetcher === 'function' ? fetcher() : fetcher);
            retryCount = 0;
            return data;
        } catch (err) {
            const error = err as AxiosError;
            if (error.response?.status === 404) {
                console.log('here');
                return options.ifNotFound || null;
            }

            if (error.response?.status === 403 || error.response?.status === 401 || retryCount === 2) {
                retryCount = 0;
                throw error;
            }
            retryCount++;
            return await retry();
        }
    };

    return retry();
};
