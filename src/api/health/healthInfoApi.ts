import apiClient from "@/api/apiClient";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useQueryHooks } from '@/hooks/useQueryHooks';
import { HealthInfo, SleepInfo } from "@/stores/onboardingStore";

const getUserId = () => {
  const userId = localStorage.getItem('userId');
  if (!userId) throw new Error('사용자 정보가 없습니다.');
  return userId;
};

// ✅ 1. 건강 정보 등록 (온보딩 시 사용)
export const useSubmitHealthInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ healthInfo, sleepInfo }: { healthInfo: HealthInfo; sleepInfo: SleepInfo }) => {
      const userId = getUserId();
      const parsedData = {
        gender: healthInfo.gender,
        age: healthInfo.age,
        height: healthInfo.height,
        weight: healthInfo.weight,
        isPregnant: healthInfo.isPregnant || false,
        isTakingBirthPill: healthInfo.isTakingBirthPill || false,
        isSmoking: healthInfo.isSmoking || false,
        hasLiverDisease: healthInfo.hasLiverDisease || false,
        sleepTime: sleepInfo.sleepTime,
        wakeUpTime: sleepInfo.wakeUpTime,
      };
      return apiClient.post(`/api/v1/users/${userId}/health`, parsedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthInfo'] });
    },
  });
};

// ✅ 사용자 건강 정보 조회 API
export const fetchHealthInfo = async () => {
  const userId = getUserId();
  const response = await apiClient.get(`/api/v1/users/${userId}/health`);
  return response.data.data;
};

// ✅ React Query로 사용자 건강 정보 조회 Hook
export const useHealthInfo = () => {
  const query = useQuery({
    queryKey: ['healthInfo'],
    queryFn: fetchHealthInfo,
    staleTime: 60000,                
    gcTime: 300000,       
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,    
  });

  const { showModal, setShowModal } = useQueryHooks(query);

  return {
    ...query,
    showModal,
    setShowModal,
  };
};

// ✅ 사용자 건강 정보 수정 API
export const updateHealthInfo = async (updatedData: any) => {
 const userId = localStorage.getItem("userId");
 if (!userId) throw new Error('사용자 정보가 없습니다.');
  const response = await apiClient.patch(`/api/v1/users/${userId}/health`, updatedData);
  return response.data;
};

const getDiff = <T extends Record<string, any>>(prev: T, next: Partial<T>) => {
    const diff: Partial<T> = {};
    Object.keys(next).forEach((key) => {
      // 간단한 얕은 비교
      if (prev[key as keyof T] !== next[key as keyof T]) {
        diff[key as keyof T] = next[key as keyof T];
      }
    });
    return diff;
};

// ✅ React Query로 사용자 건강 정보 수정 Mutation Hook
export const useUpdateHealthInfo = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
        mutationFn: async (newData: Record<string, any>) => {

          const prev = queryClient.getQueryData<Record<string, any>>(['healthInfo']);
          if (!prev) {
            return updateHealthInfo(newData);
          }
    
          const diffData = getDiff(prev, newData);
          if (Object.keys(diffData).length === 0) {
            return null;
          }

          return updateHealthInfo(diffData);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['healthInfo']});
        },
        onError: (error: any) => {
          console.error('건강 정보 업데이트 중 오류:', error);
        },
      });
  
    return {
      updateHealthInfo: mutation.mutate,
      updateHealthInfoAsync: mutation.mutateAsync,
      isLoading: mutation.status === 'pending',
      isError: mutation.status === 'error',
      isSuccess: mutation.status === 'success',
      error: mutation.error,
    };
  };
