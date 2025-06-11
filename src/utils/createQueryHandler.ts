import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { ApiResponse } from '@/types/api';

export function createQueryHandler<
  TQueryKey extends unknown[],
  TData,
  TError extends ApiResponse<unknown> = ApiResponse<null>,
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
