import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuthStore } from "@/stores/useAuthStore";

const KakaoRedirectPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const fetchKakaoToken = async () => {
      if (!code) {
        navigate("/mypage");
        return;
      }

      try {
        const response = await apiClient.post("/api/v1/auth/kakao", { code });
        const { userId, accessToken, requiresOnboarding } = response.data;

        localStorage.setItem("access_token", accessToken);
        setAuth(userId, "USER", null); 

        const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/mypage";

        if (requiresOnboarding) {
          navigate("/auth/onboarding");
        } else {
          navigate(redirectPath);
        }

        sessionStorage.removeItem("redirectAfterLogin");
      } catch (error) {
        console.error("로그인 실패:", error);
        navigate("/mypage");
      }
    };

    fetchKakaoToken();
  }, [code, navigate, setAuth]);

  return <LoadingSpinner size="small" type="beat" />;
};

export default KakaoRedirectPage;


