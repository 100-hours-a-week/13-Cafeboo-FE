interface GuestModeBannerProps {
    onKakaoLogin: () => void;
}

export default function GuestModeBanner({ onKakaoLogin }: GuestModeBannerProps) {
    return (
        <div className="absolute max-w-md top-12 left-0 h-8 z-30 w-full mx-auto flex items-center justify-between bg-black/75 px-5 py-0.5 text-white font-medium text-sm select-none">
        <div className="truncate">
            현재 게스트 모드로 실행 중입니다.
        </div>
        <button
            onClick={onKakaoLogin}
            className="bg-gray-100 text-gray-800 font-semibold px-2 rounded-sm shadow hover:bg-yellow-400 transition-colors duration-200 cursor-pointer"
        >
            로그인하기
        </button>
        </div>
    );
}
  
