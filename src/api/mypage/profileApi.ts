import apiClient from "@/api/apiClient";
import { createQueryHandler } from '@/utils/createQueryHandler';
import type { UserProfileResponseDTO } from '@/api/mypage/profile.dto';
import { getUserId } from "@/utils/auth";

// ✅ GET 요청
const fetchUserProfile = async (): Promise<UserProfileResponseDTO> => {
  const userId = getUserId();
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
      retry: 1,
    }
  );
};

