import apiClient from '../apiClient';
import { useQuery } from '@tanstack/react-query';
import { useQueryHooks } from '@/hooks/useQueryHooks';
import type { UserProfileResponseDTO } from '@/api/mypage/profile.dto';

export const fetchUserProfile = async (): Promise<UserProfileResponseDTO> => {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Error('사용자 정보가 없습니다.');

  const response = await apiClient.get(`/api/v1/users/${userId}/profile`);

  if (response.data?.data) {
    return response.data.data as UserProfileResponseDTO;
  }

  throw new Error('Invalid response format');
};

export const useUserProfile = () => {
  const query = useQuery<UserProfileResponseDTO>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 60000,
    gcTime: 300000,
    refetchOnMount: 'always',
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
