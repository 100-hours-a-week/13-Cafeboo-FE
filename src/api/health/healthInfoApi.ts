import apiClient from "@/api/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import type { HealthInfoRequestDTO, HealthInfoResponseDTO, UpdateHealthInfoRequestDTO } from "@/api/health/health.dto";
import { createMutationHandler } from "@/utils/createMutationHandler";
import { createQueryHandler } from "@/utils/createQueryHandler";
import { getUserIdFromStore } from "@/utils/auth";

// ✅ GET 요청
export const fetchHealthInfo = async (): Promise<HealthInfoRequestDTO> => {
  const userId = getUserIdFromStore();
  const response = await apiClient.get(`/api/v1/users/${userId}/health`);
  return response.data;
};

export const useHealthInfo = () =>
  createQueryHandler<['healthInfo'], HealthInfoRequestDTO>(
    ['healthInfo'],
    fetchHealthInfo,
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
export const submitHealthInfo = async (data: HealthInfoRequestDTO): Promise<void> => {
  const userId = getUserIdFromStore();
  const payload = {
    gender: data.gender,
    age: data.age,
    height: data.height,
    weight: data.weight,
    isPregnant: data.isPregnant,
    isTakingBirthPill: data.isTakingBirthPill,
    isSmoking: data.isSmoking,
    hasLiverDisease: data.hasLiverDisease,
    sleepTime: data.sleepTime,
    wakeUpTime: data.wakeUpTime,
  };
  await apiClient.post(`/api/v1/users/${userId}/health`, payload);
};

export const useSubmitHealthInfo = () =>
  createMutationHandler(submitHealthInfo, {
    onSuccess: () => {},
});

// ✅ PATCH 요청
export const updateHealthInfo = async (updatedData: UpdateHealthInfoRequestDTO) => {
  const userId = getUserIdFromStore();
  const res = await apiClient.patch(`/api/v1/users/${userId}/health`, updatedData);
  return res.data;
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

export const useUpdateHealthInfo = () => {
  const queryClient = useQueryClient();

  return createMutationHandler(
    async (newData: UpdateHealthInfoRequestDTO) => {
      const prev = queryClient.getQueryData<HealthInfoRequestDTO>(['healthInfo']);
      if (!prev) return updateHealthInfo(newData);

      const diff = getDiff(prev, newData);
      if (Object.keys(diff).length === 0) return null;

      return updateHealthInfo(diff);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['healthInfo'] });
      },
    }
  );
};

