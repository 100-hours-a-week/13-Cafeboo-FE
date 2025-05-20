import SignupForm, { SignupFormData } from '@/components/auth/SignupForm';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = async (data: SignupFormData) => {
    // 회원가입 처리 로직
    navigate('/auth/onboarding');
  };

  const checkNicknameAvailability = async (nickname: string) => {
    // 중복 확인 처리 로직 (예시: API 요청)
    return true;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <SignupForm
          onSubmit={handleSignup}
          checkNicknameAvailability={checkNicknameAvailability}
        />
      </div>
    </div>
  );
};

export default SignupPage;
