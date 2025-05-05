import KakaoIcon from '@/components/auth/KaKaoIcon';

interface SocialLoginProps {
  onSocialLogin: (platform: string) => Promise<void>;
}

const SocialLogin = ({ onSocialLogin }: SocialLoginProps) => {
  return (
    <div className="w-full max-w-xs mx-auto text-center mt-8">
      <div className="flex items-center justify-center my-6">
        <div className="h-px bg-[#939393] flex-1" />
        <span className="mx-2 text-[#939393] text-sm">SNS 계정으로 로그인하기</span>
        <div className="h-px bg-[#939393] flex-1" />
      </div>

      <button
        onClick={() => onSocialLogin('kakao')}
        className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <KakaoIcon />
      </button>

      <p className="text-base text-[#595959]">
        아직 계정이 없으신가요?{' '}
        <a href="/auth/signup" className="text-base text-[#FF8F00] font-semibold">
          회원가입
        </a>
      </p>
    </div>
  );
};

export default SocialLogin;
