import apiClient from "@/api/apiClient";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CaffeineIntakeRequestDTO,
  UpdateCaffeineIntakeRequestDTO,
} from '@/api/caffeine/caffeine.dto';

export const recordCaffeineIntake = async (data: CaffeineIntakeRequestDTO) => {
  const response = await apiClient.post("/api/v1/caffeine-intakes", data);
  return response.data;
};

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

  const mutation = useMutation({
    mutationFn: (updatedFields: UpdateCaffeineIntakeRequestDTO) =>
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

export const deleteCaffeineIntake = async (intakeId: string) => {
  const response = await apiClient.delete(
    `/api/v1/caffeine-intakes/${intakeId}`
  );
  return response.data;
};

export const useDeleteCaffeineIntake = (intakeId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
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