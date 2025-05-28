import apiClient from "@/api/apiClient";
import { useQueryClient } from '@tanstack/react-query';
import { createMutationHandler } from '@/utils/createMutationHandler';

// ✅ POST 요청
const logout = async () => {
  await apiClient.post('/api/v1/auth/logout');
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  const handleAfterLogout = () => {
    localStorage.setItem('afterLogout', 'true');
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId');
    queryClient.clear();
    window.location.href = '/auth/login';
  };

  return createMutationHandler<void, Error, void>(
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
