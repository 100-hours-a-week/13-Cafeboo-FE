interface GuestModeBannerProps {
    onKakaoLogin: () => void;
}

export default function GuestModeBanner({ onKakaoLogin }: GuestModeBannerProps) {
    return (
        <div className="absolute max-w-md top-12 left-0 h-8 z-30 w-full mx-auto flex items-center justify-between bg-black/60 px-5 py-0.5 text-white font-semibold text-sm select-none">
        <div className="truncate">
            현재 게스트 모드로 실행 중입니다.
        </div>
        <button
            onClick={onKakaoLogin}
            className="bg-gray-100 text-gray-800 font-semibold px-2 rounded-sm shadow hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
        >
            로그인하러 가기
        </button>
        </div>
    );
}
  
