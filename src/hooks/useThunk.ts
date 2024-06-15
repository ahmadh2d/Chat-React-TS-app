/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

export const useThunk = (thunk: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const dispatch: Dispatch<any> = useDispatch();

  const runThunk = useCallback((arg: any) => {
    setIsLoading(true);
    dispatch(thunk(arg))
      .unwrap()
      .catch((error: Error) => setError(error))
      .finally(() => setIsLoading(false));
  }, [dispatch, thunk]);

  return [runThunk, isLoading, error] as const;
};