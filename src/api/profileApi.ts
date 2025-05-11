import apiClient from './apiClient';
import { useQuery } from '@tanstack/react-query';
import { useQueryHooks } from '@/hooks/useQueryHooks';

export const fetchUserProfile = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Error('사용자 정보가 없습니다.');
  const response = await apiClient.get(`/api/v1/user/${userId}/profile`);
  if (response.data?.data) {
    return response.data.data;
  }
  throw new Error('Invalid response format');
};

export const useUserProfile = () => {
  const query = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 300000,       
    gcTime: 600000,        
    refetchInterval: 300000,    
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,              
  });

  const { showModal, setShowModal } = useQueryHooks(query);

  return {
    ...query,
    showModal,
    setShowModal,
  };
};
