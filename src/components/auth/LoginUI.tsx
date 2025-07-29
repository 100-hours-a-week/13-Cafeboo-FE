import Logo from '@/assets/logo.png?w=96;192;288&format=webp;avif&as=picture';
import KakaoIcon from './KaKaoIcon';
import PageLayout from '@/layout/PageLayout';

interface LoginUIProps {
  onKakaoLogin: () => void;
}

const LoginUI: React.FC<LoginUIProps> = ({ onKakaoLogin }) => {
  return (
    <PageLayout headerMode="logo" mainClassName='mt-6'>
        <div className="flex flex-col bg-gray-50 shadow-[0_0_5px_rgba(0,0,0,0.15)] rounded items-center px-8 py-6 m-3">
            <picture>
                <source srcSet={Logo.sources.avif} type="image/avif" />
                <source srcSet={Logo.sources.webp} type="image/webp" />
                <img
                  src={Logo.img.src}
                  alt="Cafeboo 로고"
                  width={Logo.img.w}
                  height={Logo.img.h}
                  className="w-24 h-auto mb-2"
                />
              </picture>
            <p className="text-center mb-6 max-w-xs leading-relaxed font-semibold">
                일상의 카페인을 기록해보세요! 
            </p>

            <button
                onClick={onKakaoLogin}
                className="relative flex items-center w-full max-w-xs bg-[#FEE500] rounded-md shadow-md px-4 py-3 cursor-pointer"
                >
        
                <div className="absolute left-4 flex items-center">
                    <KakaoIcon />
                </div>

                <span className="flex-1 text-center text-black font-semibold">
                    카카오 로그인
                </span>
            </button>

            <p className="mt-6 text-gray-500 text-sm">
                로그인하시면 나만의 맞춤 분석과 추천 기능을 경험하실 수 있습니다.
            </p>
        </div>
    </PageLayout>
  );
};

export default LoginUI;
