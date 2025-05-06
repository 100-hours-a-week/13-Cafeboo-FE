import LoginForm, { LoginFormData } from '@/components/auth/LoginForm';
import SocialLogin from '@/components/auth/SocialLogin';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '@/components/common/DarkModeToggle';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (data: LoginFormData) => {
    console.log('로그인 시도', data);
    // 예시: 로그인 성공 시
    navigate('/main/home');
  };

  const handleSocialLogin = async (platform: string) => {
    console.log(`${platform} 로그인`);
    // 예시: 소셜 로그인 성공
    navigate('/main/home');
  };

  return (
    <div className="min-h-screen w-full bg-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center w-full max-w-md">
            <LoginForm onLogin={handleLogin} />
            <SocialLogin onSocialLogin={handleSocialLogin} />
        </div>
    </div>
  );
};

export default LoginPage;