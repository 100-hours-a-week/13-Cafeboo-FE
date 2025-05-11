import apiClient from '@/api/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// ✅ 카페인 음료 섭취 내역 수정 데이터 타입
export interface UpdateIntakePayload {
  drinkId?: string;
  drinkSize?: string;
  intakeTime?: string; 
  drinkCount?: number;
  caffeineAmount?: number;
}

// ✅ 카페인 음료 섭취 수정 API 호출
export const patchCaffeineIntake = async (
  intakeId: string,
  updatedFields: UpdateIntakePayload
) => {
  const response = await apiClient.patch(
    `/api/v1/caffeine-intakes/${intakeId}`,
    updatedFields
  );
  return response.data;
};

// ✅ React Query 훅: 수정 뮤테이션
export const useUpdateCaffeineIntake = (intakeId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      any,                  
      Error,               
      UpdateIntakePayload 
    >({
      // ★ mutationFn으로 함수 지정
      mutationFn: (updatedFields) =>
        patchCaffeineIntake(intakeId, updatedFields),
  
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dailyIntake'] });
        queryClient.invalidateQueries({ queryKey: ['calendar'] });
      },
    });
  
    return {
      updateIntake: mutation.mutate,
      updateIntakeAsync: mutation.mutateAsync,
      isUpdating: mutation.isPending,
      isUpdateError: mutation.isError,
      updateError: mutation.error,
    };
};

// ✅ 카페인 음료 섭취 삭제 API 호출
export const deleteCaffeineIntake = async (intakeId: string) => {
  const response = await apiClient.delete(
    `/api/v1/caffeine-intakes/${intakeId}`
  );
  return response.data;
};

// ✅ React Query 훅: 삭제 뮤테이션
export const useDeleteCaffeineIntake = (intakeId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
      any,
      Error,
      void
    >({
      mutationFn: () => deleteCaffeineIntake(intakeId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dailyIntake'] });
        queryClient.invalidateQueries({ queryKey: ['calendar'] });
      },
    });
  
    return {
      deleteIntake: mutation.mutate,
      deleteIntakeAsync: mutation.mutateAsync,
      isDeleting: mutation.isPending,
      isDeleteError: mutation.isError,
      deleteError: mutation.error,
    };
};
