import apiClient from "@/api/apiClient";
import { useQueryClient } from '@tanstack/react-query';
import { createMutationHandler } from '@/utils/createMutationHandler';
import { getUserIdFromStore } from "@/utils/auth";
import { useAuthStore } from "@/stores/useAuthStore";
import type { ApiResponse } from '@/types/api';
import { useNavigate } from "react-router-dom";

// ✅ DELETE 요청
const deleteUser = async () => {
  const userId = getUserIdFromStore();
  await apiClient.delete(`/api/v1/users/${userId}`);
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  return createMutationHandler<void, ApiResponse<null>, void>(
    deleteUser,
    {
      onSuccess: () => {
        localStorage.removeItem('access_token');
        clearAuth();
        queryClient.clear();
        navigate('/mypage');
      },
      onError: (error) => {
        console.error('회원탈퇴 중 오류:', error);
      },
    }
  );
};

