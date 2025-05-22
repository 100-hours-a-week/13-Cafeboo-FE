import apiClient from './apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const logout = async () => {
  await apiClient.post('/api/v1/auth/logout');
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
      mutationFn: logout, 
      onSuccess: () => {
        localStorage.setItem('afterLogout', 'true');
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        queryClient.clear(); 
        window.location.href = '/auth/login';
      },
      onError: (error: any) => {
        console.error("로그아웃 중 오류:", error);
        localStorage.setItem('afterLogout', 'true');
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        queryClient.clear(); 
        window.location.href = '/auth/login';
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
