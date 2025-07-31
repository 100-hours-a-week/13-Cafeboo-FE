import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import type { ApiResponse } from '@/types/api';

type MutationHandlerReturn<TData, TError, TVariables> = {
  mutateFn: (variables: TVariables) => void;
  mutateAsyncFn: (variables: TVariables) => Promise<TData>;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: TError | null;
  data: TData | null;
};

export function createMutationHandler<
  TData,
  TError extends ApiResponse<unknown> = ApiResponse<null>,
  TVariables = void,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
): MutationHandlerReturn<TData, TError, TVariables> {
  const mutation = useMutation<TData, TError, TVariables>({
    mutationFn,
    ...options,
  });

  return {
    mutateFn: mutation.mutate,
    mutateAsyncFn: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error ?? null,
    data: mutation.data ?? null,
  };
}
