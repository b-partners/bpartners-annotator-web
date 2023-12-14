/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { retryer } from '../utils';

interface UseFetchState<T> {
  isLoading: boolean;
  error: AxiosError | null;
  data: T | null;
}

export const useFetch = <T>(fetcher: () => Promise<T>, onlyOnMutate: boolean = false) => {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const localFetcher = (onDone?: () => void) => {
    const _ = async () => {
      setState(e => ({ ...e, error: null, isLoading: true }));
      try {
        const data = await retryer(fetcher);
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
      localFetcher();
    }
  }, []);

  return {
    ...state,
    fetcher: localFetcher,
  };
};
