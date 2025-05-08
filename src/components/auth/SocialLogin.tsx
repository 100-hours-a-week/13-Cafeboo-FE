import KakaoIcon from '@/components/auth/KaKaoIcon';
import { Info } from 'lucide-react'
import { useState } from 'react'
import AlertModal from '@/components/common/AlertModal'

interface SocialLoginProps {
  onSocialLogin: (platform: string) => Promise<void>;
}

const SocialLogin = ({ onSocialLogin }: SocialLoginProps) => {
  const [showModal, setShowModal] = useState(false)
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
        <span className="text-base text-[#FF8F00] font-semibold cursor-pointer" onClick={() => setShowModal(true)}>
          회원가입
        </span>
      </p>
      {/* 소셜로그인 안내 모달 */}
      <AlertModal
        isOpen={showModal}
        icon={<Info size={36} className="text-[#FE9400]" />}
        title="회원가입 안내"
        message="현재는 소셜 회원가입만 지원합니다."
        onClose={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
        confirmText="확인"
        showCancelButton={false}
      />
    </div>
  );
};

export default SocialLogin;
