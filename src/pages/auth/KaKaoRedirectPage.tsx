import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const KakaoRedirectPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  console.log(code);

  useEffect(() => {
    const fetchKakaoToken = async () => {
      if (!code) {
        console.error("카카오 로그인 코드가 존재하지 않습니다.");
        navigate("/auth/login");
        return;
      }

      try {
        const response = await apiClient.post("/api/v1/auth/kakao", { code });

        console.log(response.data);
        const { userId, accessToken, requiresOnboarding } = response.data;

        // Access Token 로컬스토리지 저장
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("userId", userId);

        // 온보딩 페이지 필요 여부에 따라 경로 설정
        if (requiresOnboarding) {
          navigate("/auth/onboarding");
        } else {
          navigate("/main/home"); // 로그인 성공 후 메인 페이지로 이동
        }
      } catch (error: any) {
        console.error("카카오 로그인 처리 실패:", error.response?.data?.message || error.message);
        navigate("/auth/login");
      }
    };

    fetchKakaoToken();
  }, [code, navigate]);

  return <LoadingSpinner size="large" type="clip"/>
};

export default KakaoRedirectPage;
