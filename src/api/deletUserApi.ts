import apiClient from './apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteUser = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Error('사용자 정보가 없습니다.');
  await apiClient.delete(`/api/v1/user/${userId}`);
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({

    mutationFn: deleteUser,
    onSuccess: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('userId');
      queryClient.clear();
      window.location.href = '/auth/login';
    },

    onError: (error: any) => {
      console.error('회원탈퇴 중 오류:', error);
    },
  });

  return {
    deleteUser: mutation.mutate,          
    isLoading: mutation.status === 'pending', 
    isError: mutation.status === 'error',
    isSuccess: mutation.status === 'success',
    error: mutation.error,    
  };
};
