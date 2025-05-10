import LoginForm, { LoginFormData } from '@/components/auth/LoginForm';
import SocialLogin from '@/components/auth/SocialLogin';
import { useNavigate } from 'react-router-dom';
import { requestKakaoLogin } from "@/api/authApi";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (data: LoginFormData) => {
    console.log('로그인 시도', data);
    // 예시: 로그인 성공 시
    navigate('/main/home');
  };

  const handleSocialLogin = async (platform: string) => {
    if(platform=='kakao'){
      try {
        await requestKakaoLogin();
      } catch (error) {
        console.error("카카오 로그인 요청 실패:", error);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-md">
        <LoginForm onLogin={handleLogin} />
        <SocialLogin onSocialLogin={handleSocialLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
