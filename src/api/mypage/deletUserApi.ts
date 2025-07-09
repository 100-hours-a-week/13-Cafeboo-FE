import apiClient from "@/api/apiClient";
import { useQueryClient } from '@tanstack/react-query';
import { createMutationHandler } from '@/utils/createMutationHandler';
import { getUserIdFromStore } from "@/utils/auth";
import { useUserStore } from "@/stores/useUserStore";
import type { ApiResponse } from '@/types/api';

// ✅ DELETE 요청
const deleteUser = async () => {
  const userId = getUserIdFromStore();
  await apiClient.delete(`/api/v1/users/${userId}`);
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const clearUserId = useUserStore((state) => state.clearUserId);

  return createMutationHandler<void, ApiResponse<null>, void>(
    deleteUser,
    {
      onSuccess: () => {
        clearUserId();
        localStorage.removeItem('access_token');
        queryClient.clear();
        window.location.href = '/mypage';
      },
      onError: (error) => {
        console.error('회원탈퇴 중 오류:', error);
      },
    }
  );
};

