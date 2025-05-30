import apiClient from "@/api/apiClient";
import { useQueryClient } from '@tanstack/react-query';
import type { CaffeineInfoRequestDTO, CaffeineInfoResponseDTO, UpdateCaffeineInfoRequestDTO } from '@/api/caffeine/caffeine.dto';
import { createMutationHandler } from '@/utils/createMutationHandler';
import { createQueryHandler } from '@/utils/createQueryHandler';
import { getUserId } from "@/utils/auth";

// ✅ GET 요청
export const fetchCaffeineInfo = async (): Promise<CaffeineInfoResponseDTO> => {
  const userId = getUserId();
  const response = await apiClient.get(`/api/v1/users/${userId}/caffeine`);
  return response.data.data;
};

export const useCaffeineInfo = () =>
  createQueryHandler<['caffeineSettings'], CaffeineInfoResponseDTO>(
    ['caffeineSettings'],
    fetchCaffeineInfo,
    {
      staleTime: 60000,
      gcTime: 300000,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
    }
);

// ✅ POST 요청
export const submitCaffeineInfo = async (data: CaffeineInfoRequestDTO): Promise<void> => {
  const userId = getUserId();
  await apiClient.post(`/api/v1/users/${userId}/caffeine`, data);
};

export const useSubmitCaffeineInfo = () => {
  return createMutationHandler(submitCaffeineInfo, {
    onSuccess: () => {
    },
  });
};

// ✅ PATCH 요청
export const updateCaffeineInfo = async (updatedData: UpdateCaffeineInfoRequestDTO) => {
  const userId = getUserId();
  const response = await apiClient.patch(`/api/v1/users/${userId}/caffeine`, updatedData);
  return response.data;
};

const getDiff = <T extends Record<string, any>>(prev: T, next: Partial<T>) => {
  const diff: Partial<T> = {};
  Object.keys(next).forEach((key) => {
    const p = prev[key as keyof T];
    const n = next[key as keyof T];

    if (JSON.stringify(p) !== JSON.stringify(n)) {
      diff[key as keyof T] = n;
    }
  });
  return diff;
};

export const useUpdateCaffeineInfo = () => {
  const queryClient = useQueryClient();

  return createMutationHandler(
    async (newData: UpdateCaffeineInfoRequestDTO) => {
      const prev = queryClient.getQueryData<CaffeineInfoRequestDTO>(['caffeineInfo']);
      if (!prev) return updateCaffeineInfo(newData);

      const diff = getDiff(prev, newData);
      if (Object.keys(diff).length === 0) return null;

      return updateCaffeineInfo(diff);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['caffeineInfo'] });
      },
    }
  );
};

