import Routes from '@/routes';
import './index.css';
import Logo from '@/assets/logo.svg';
import Icon from '@/assets/cute_coffee_favicon_128.ico';
import BG from '@/assets/background.png';
import CustomToast from '@/components/common/CustomToast';

function App() {
  return (
    <div className="relative w-full h-[100svh] overflow-hidden">
      {/* 배경 고정 */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${BG})`,
          backgroundRepeat: 'repeat',
          backgroundPosition: 'top left',
          backgroundSize: 'auto',
        }}
      />

      {/* 좌측 설명 영역 (Desktop only) */}
      <div className="fixed top-1/2 -translate-y-1/2 xl:ml-36 2xl:left-50 p-8 hidden lg:flex flex-col items-center justify-center z-10">
        <div className="flex items-center justify-center">
          <img src={Icon} alt="CafeBoo Logo" className="h-28 w-auto mb-6" />
          <img src={Logo} alt="Cafeboo" className="h-28 w-auto" />
        </div>
        <div className="text-xl font-semibold items-center justify-center">
          일상의 카페인을 기록해보세요!
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="relative z-10 w-full h-full max-w-sm mx-auto lg:ml-128 xl:ml-192 2xl:ml-272">
        <div
          id="alert-modal-container"
          className="relative w-full h-full bg-white px-6 overflow-hidden scrollbar-hide"
        >
          <Routes />
          <CustomToast />
        </div>
      </div>
    </div>
  );
}

export default App;

