import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { ApiResponse } from "@/types/api";
import { useUserStore } from "@/stores/useUserStore";

type LoginResponse = {
  userId: string;
  accessToken: string;
  requiresOnboarding: boolean;
};

const KakaoRedirectPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const setUserId = useUserStore((state) => state.setUserId);

  useEffect(() => {
    const fetchKakaoToken = async () => {
      if (!code) {
        navigate("/auth/login");
        return;
      }

      try {
        const response = await apiClient.post<LoginResponse>("/api/v1/auth/kakao", { code });
        const { userId, accessToken, requiresOnboarding } = response.data;

        // Access Token 로컬스토리지 저장
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("userId", userId);
        setUserId(userId);

        // 온보딩 페이지 필요 여부에 따라 경로 설정
        if (requiresOnboarding) {
          navigate("/auth/onboarding");
        } else {
          navigate("/main/home"); // 로그인 성공 후 메인 페이지로 이동
        }
      } catch (error: unknown) {
        const err = error as ApiResponse<null>;
        const message = err.message ?? "로그인 처리 중 오류가 발생했습니다.";
        console.error("로그인 실패:", message);
        navigate("/auth/login");
      }
    };

    fetchKakaoToken();
  }, [code, navigate]);

  return <LoadingSpinner size="large" type="clip"/>
};

export default KakaoRedirectPage;
