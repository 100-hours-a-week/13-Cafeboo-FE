import apiClient from '@/api/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import { createQueryHandler } from '@/utils/createQueryHandler';
import { createMutationHandler } from '@/utils/createMutationHandler';
import type {
  UserProfileResponseDTO,
  UpdateUserProfilePayload,
} from '@/api/mypage/profile.dto';
import { getUserIdFromStore } from '@/utils/auth';
import { useToastStore } from '@/stores/toastStore';

// ✅ GET 요청
const fetchUserProfile = async (): Promise<UserProfileResponseDTO> => {
  const userId = getUserIdFromStore();
  const response = await apiClient.get(`/api/v1/users/${userId}/profile`);
  if (response.data) {
    return response.data;
  }
  throw new Error('Invalid response format');
};

export const useUserProfile = () => {
  return createQueryHandler(['userProfile'], fetchUserProfile, {
    staleTime: 60000,
    gcTime: 300000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });
};

// ✅ PATCH 요청
export const fetchUpdateUserProfile = async (
  payload: UpdateUserProfilePayload
): Promise<void> => {
  const userId = getUserIdFromStore();
  if (!userId) throw new Error('User ID is not available');

  const formData = new FormData();
  if (payload.nickname !== undefined)
    formData.append('nickname', payload.nickname);
  if (payload.profileImage)
    formData.append('profileImage', payload.profileImage);

  await apiClient.patch(`/api/v1/users/${userId}/profile`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return createMutationHandler(
    (payload: UpdateUserProfilePayload) => fetchUpdateUserProfile(payload),
    {
      onSuccess: () => {
        const userId = getUserIdFromStore();
        if (userId)
          queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
        showToast('success', '프로필이 수정되었습니다!');
      },
      onError: (error: any) => {
        showToast(
          'error',
          error?.message || '프로필 수정 중 오류가 발생했습니다.'
        );
      },
    }
  );
};
