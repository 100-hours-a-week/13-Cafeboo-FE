import apiClient from "@/api/apiClient";
import { useQueryClient } from '@tanstack/react-query';
import { createMutationHandler } from '@/utils/createMutationHandler';
import { getUserId } from "@/utils/auth";

// ✅ DELETE 요청
const deleteUser = async () => {
  const userId = getUserId();
  await apiClient.delete(`/api/v1/users/${userId}`);
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return createMutationHandler<void, Error, void>(
    deleteUser,
    {
      onSuccess: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        queryClient.clear();
        window.location.href = '/auth/login';
      },
      onError: (error) => {
        console.error('회원탈퇴 중 오류:', error);
      },
    }
  );
};

