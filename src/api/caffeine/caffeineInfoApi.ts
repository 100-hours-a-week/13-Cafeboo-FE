import apiClient from "@/api/apiClient";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useQueryHooks } from '@/hooks/useQueryHooks';
import { CaffeineInfo, SleepInfo } from '@/stores/onboardingStore';

const getUserId = () => {
  const userId = localStorage.getItem('userId');
  if (!userId) throw new Error('사용자 정보가 없습니다.');
  return userId;
};

// ✅ 카페인 설정 등록 (온보딩용)
export const useSubmitCaffeineInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ caffeineInfo, sleepInfo }: { caffeineInfo: CaffeineInfo; sleepInfo: SleepInfo }) => {
      const userId = getUserId();
      const parsedData = {
        caffeineSensitivity: caffeineInfo.caffeineSensitivity,
        averageDailyCaffeineIntake: caffeineInfo.averageDailyCaffeineIntake,
        frequentDrinkTime: sleepInfo.frequentDrinkTime || "00:00",
        userFavoriteDrinks: caffeineInfo.userFavoriteDrinks || [],
      };
      return apiClient.post(`/api/v1/users/${userId}/caffeine`, parsedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caffeineInfo'] });
    },
  });
};

// ✅ 사용자 카페인 설정 조회 API
export const fetchCaffeineInfo = async () => {
  const userId = getUserId();
  const response = await apiClient.get(`/api/v1/users/${userId}/caffeine`);
  return response.data.data;
};

// ✅ React Query로 사용자 카페인 설정 조회 Hook
export const useCaffeineInfo = () => {
  const query = useQuery({
    queryKey: ['caffeineSettings'],
    queryFn: fetchCaffeineInfo,
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

// ✅ 사용자 카페인 설정 수정 API
export const updateCaffeineInfo = async (updatedData: any) => {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Error('사용자 정보가 없습니다.');
  const response = await apiClient.patch(`/api/v1/users/${userId}/caffeine`, updatedData);
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


// ✅ React Query로 사용자 카페인 설정 수정 Mutation Hook
export const useUpdateCaffeineInfo = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: async (newData: Record<string, any>) => {
        const prev = queryClient.getQueryData<Record<string, any>>(['caffeineInfo']);
        if (!prev) {
          return updateCaffeineInfo(newData);
        }
        const diffData = getDiff(prev, newData);
        if (Object.keys(diffData).length === 0) {
          return null;
        }
        return updateCaffeineInfo(diffData);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey:['caffeineInfo']});
      },
      onError: (error: any) => {
        console.error('카페인 설정 수정 중 오류:', error);
      },
    });
  
    return {
      updateCaffeineInfo: mutation.mutate ,
      updateCaffeineInfoAsync: mutation.mutateAsync,
      isLoading: mutation.status === 'pending',
      isError: mutation.status === 'error',
      isSuccess: mutation.status === 'success',
      error: mutation.error,
    };
  };
