import { useAuthStore } from '@/stores/useAuthStore';

export const getUserIdFromStore = (): string => {
  const userId = useAuthStore.getState().userId;
  if (!userId) {
    throw new Error('로그인 정보가 없습니다.');
  }
  return userId;
};
