import apiClient from "@/api/apiClient";
import { createQueryHandler } from '@/utils/createQueryHandler';
import type { UserProfileResponseDTO } from '@/api/mypage/profile.dto';

// ✅ GET 요청
const fetchUserProfile = async (): Promise<UserProfileResponseDTO> => {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Error('사용자 정보가 없습니다.');

  const response = await apiClient.get(`/api/v1/users/${userId}/profile`);

  if (response.data?.data) {
    return response.data.data;
  }

  throw new Error('Invalid response format');
};

export const useUserProfile = () => {
  return createQueryHandler(
    ['userProfile'],
    fetchUserProfile,
    {
      staleTime: 60000,
      gcTime: 300000,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
    }
  );
};

