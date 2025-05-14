import apiClient from './apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestKakaoLogout } from './authApi';

export const logout = async () => {
  await apiClient.post('/api/v1/auth/logout');
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
      mutationFn: logout, 
      onSuccess: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        queryClient.clear(); 
        requestKakaoLogout();
      },
      onError: (error: any) => {
        console.error("로그아웃 중 오류:", error);
      },
    });
  
    return {
      logout: mutation.mutate,
      isLoading: mutation.isPending,  
      isError:   mutation.isError,
      isSuccess: mutation.isSuccess,
      error:     mutation.error,
    };
  };
