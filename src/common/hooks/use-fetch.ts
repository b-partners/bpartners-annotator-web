/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { retryer } from '../utils';

interface UseFetchState<T> {
    isLoading: boolean;
    error: AxiosError | null;
    data: T | null;
}

interface UseFetchParams<T, P extends Record<string, any>> {
    fetcher: (params?: P) => Promise<T>;
    onlyOnMutate?: boolean;
    defaultData?: T;
    defaultParams?: P;
}

export const useFetch = <T = unknown, P extends { page?: number; perPage?: number } = {}>(
    params: UseFetchParams<T, P>
) => {
    const { fetcher, defaultData, defaultParams, onlyOnMutate = false } = params;

    const [state, setState] = useState<UseFetchState<T>>({
        data: defaultData || null,
        error: null,
        isLoading: false,
    });

    const localFetcher = (params?: P, onDone?: () => void) => {
        const _ = async () => {
            setState(e => ({ ...e, error: null, isLoading: true }));
            try {
                const data = await retryer(fetcher(params));
                setState(e => ({ ...e, data, isLoading: false }));
                onDone && onDone();
            } catch (err) {
                const error = err as AxiosError;
                setState(e => ({ ...e, error, isLoading: false }));
            }
        };
        _();
    };

    useEffect(() => {
        if (!onlyOnMutate) {
            localFetcher(defaultParams);
        }
    }, []);

    return {
        ...state,
        fetcher: localFetcher,
    };
};
