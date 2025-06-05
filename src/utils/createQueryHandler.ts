import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export function createQueryHandler<
  TQueryKey extends unknown[],
  TData,
  TError = AxiosError,
>(
  key: TQueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData, TQueryKey>({
    queryKey: key,
    queryFn,
    ...options,
  });
}
