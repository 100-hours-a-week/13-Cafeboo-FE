import GuestModeBanner from "@/components/home/GuestModeBanner";
import { useAuthStore } from "@/stores/useAuthStore";

export default function GuestModeBannerContainer() {
  const kakaoLogin = useAuthStore((state) => state.kakaoLogin);

  const handleKakaoLogin = async () => {
    try {
      await kakaoLogin();
    } catch (error) {
      console.error("카카오 로그인 실패:", error);
    }
  };

  return <GuestModeBanner onKakaoLogin={handleKakaoLogin} />;
}
