import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGuestLogin } from '@/api/auth/guestLoginApi';

export default function AuthInitializer() {
  const userId = useAuthStore((state) => state.userId);
  const isGuestTokenValid = useAuthStore((state) => state.isGuestTokenValid);
  const { mutateAsyncFn: guestLogin } = useGuestLogin();

  useEffect(() => {
    if (!userId || !isGuestTokenValid()) {
      guestLogin();
    }
  }, [userId, isGuestTokenValid, guestLogin]);

  return null;
}
