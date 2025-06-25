import apiClient from "@/api/apiClient";
import { useQueryClient } from '@tanstack/react-query';
import { createMutationHandler } from '@/utils/createMutationHandler';
import { useUserStore } from '@/stores/useUserStore';
import type { ApiResponse } from '@/types/api';

// ✅ POST 요청
const logout = async () => {
  await apiClient.post('/api/v1/auth/logout');
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearUserId = useUserStore((state) => state.clearUserId);

  const handleAfterLogout = () => {
    localStorage.setItem('afterLogout', 'true');
    localStorage.removeItem('access_token');
    clearUserId();   
    queryClient.clear();
    window.location.href = '/auth/login';
  };

  return createMutationHandler<void, ApiResponse<null>, void>(
    logout,
    {
      onSuccess: handleAfterLogout,
      onError: (error) => {
        console.error('로그아웃 중 오류:', error);
        handleAfterLogout();
      },
    }
  );
};
