import apiClient from '@/api/apiClient';
import { useAuthStore } from '@/stores/useAuthStore';
import { createMutationHandler } from '@/utils/createMutationHandler';
import type { ApiResponse } from '@/types/api';

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export interface GuestLoginResponse {
  accessToken: string;
  userId: string;
  role: 'GUEST' | 'USER';
}

async function guestLoginApi(): Promise<GuestLoginResponse> {
  const response = await apiClient.post('/api/v1/auth/guest');
  return response.data;
}

export function useGuestLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return createMutationHandler<GuestLoginResponse, ApiResponse<unknown>, void>(guestLoginApi, {
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.accessToken);
      setAuth(data.userId, data.role, getTodayDateString());
    },
    onError: (error) => {
      console.error('비회원 로그인 실패:', error);
    },
  });
}


