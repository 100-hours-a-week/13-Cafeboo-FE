import Routes from '@/routes';
import './index.css';
import Logo from '@/assets/logo.png?w=320;640;1280&format=webp;avif&as=picture';
import Icon from '@/assets/icon.svg';
import BG from '@/assets/background.png?w=1024;1468&format=webp;avif&quality=95&as=picture';
import CustomToast from '@/components/common/CustomToast';
import AuthInitializer from '@/providers/AuthInitializer'; 

function App() {
  return (
    <div className="relative w-full h-[100svh] overflow-hidden">
      {/* 배경 고정 */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${BG.img.src})`,
          backgroundRepeat: 'repeat',
          backgroundPosition: 'top left',
          backgroundSize: 'auto' 
        }}
      />

      {/* 좌측 설명 영역 */}
      <div className="fixed top-1/2 -translate-y-1/2 xl:ml-36 2xl:left-50 p-8 hidden lg:flex flex-col items-center justify-center z-10">
        <div className="flex items-center justify-center">
          <img src={Icon} alt="CafeBoo Logo" width={36} height={36} className="h-30 w-auto mb-6 mr-1" />
          <picture>
            <source src={Logo.sources.avif} type="image/avif" />
            <source src={Logo.sources.webp} type="image/webp" />
            <img
              src={Logo.img.src}
              alt="Cafeboo"
              width={Logo.img.w}
              height={Logo.img.h}
              className="h-36 w-auto"
            />
          </picture>
        </div>
        <div className="text-xl font-semibold items-center justify-center">
          일상의 카페인을 기록해보세요!
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="relative z-10 w-full h-full max-w-sm mx-auto lg:ml-128 xl:ml-192 2xl:ml-272">
        <div
          id="alert-modal-container"
          className="relative w-full h-full bg-white px-4 overflow-hidden scrollbar-hide"
        >
          <AuthInitializer />
          <Routes />
          <CustomToast />
        </div>
      </div>
    </div>
  );
}

export default App;

