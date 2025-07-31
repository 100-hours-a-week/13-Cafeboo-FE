import apiClient from '@/api/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import type {
  CaffeineIntakeRequestDTO,
  UpdateCaffeineIntakeRequestDTO,
} from '@/api/caffeine/caffeine.dto';
import { createMutationHandler } from '@/utils/createMutationHandler';

// ✅ POST 요청
export const recordCaffeineIntake = async (data: CaffeineIntakeRequestDTO) => {
  const response = await apiClient.post('/api/v1/caffeine-intakes', data);
  return response.data;
};

export const useRecordCaffeineIntake = () => {
  const queryClient = useQueryClient();

  return createMutationHandler(recordCaffeineIntake, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyIntake'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
};

// ✅ PATCH 요청
export const patchCaffeineIntake = async (
  intakeId: string,
  updatedFields: UpdateCaffeineIntakeRequestDTO
) => {
  const response = await apiClient.patch(
    `/api/v1/caffeine-intakes/${intakeId}`,
    updatedFields
  );
  return response.data;
};

export const useUpdateCaffeineIntake = (intakeId: string) => {
  const queryClient = useQueryClient();

  return createMutationHandler(
    (updatedFields: UpdateCaffeineIntakeRequestDTO) =>
      patchCaffeineIntake(intakeId, updatedFields),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dailyIntake'] });
        queryClient.invalidateQueries({ queryKey: ['calendar'] });
      },
    }
  );
};

// ✅ DELETE 요청
const deleteCaffeineIntake = async (intakeId: string) => {
  const response = await apiClient.delete(
    `/api/v1/caffeine-intakes/${intakeId}`
  );
  return response.data;
};

export const useDeleteCaffeineIntake = (intakeId: string) => {
  const queryClient = useQueryClient();

  return createMutationHandler(() => deleteCaffeineIntake(intakeId), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyIntake'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
  });
};
