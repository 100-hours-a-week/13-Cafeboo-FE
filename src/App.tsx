import Routes from '@/routes';
import './index.css';
import Logo from '@/assets/logo.svg';
import Icon from '@/assets/cute_coffee_favicon_128.ico'
import BG from '@/assets/background.png'
import CustomToast from '@/components/common/CustomToast';

function App() {
  return (
    <div
      className="min-h-screen flex items-center justify-start"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundRepeat: 'repeat',
        backgroundPosition: 'top left',
        backgroundSize: 'auto',
      }}
    >
      <div className="fixed top-1/2 -translate-y-1/2 xl:ml-36 2xl:left-50 p-8 hidden lg:flex flex-col items-center justify-center">
        <div className="flex items-center justify-center">
          <img src={Icon} alt="CafeBoo Logo" className="h-28 w-auto mb-6"/>
          <img src={Logo} alt="Cafeboo" className="h-28 w-auto"/>
        </div>
        <div className="text-xl font-semibold items-center justify-center">
          일상의 카페인을 기록해보세요!
        </div>
      </div>
      <div className="mx-auto lg:ml-128 xl:ml-192 2xl:ml-272">
        <div
            id="alert-modal-container" 
            className="relative w-screen w-full h-[100dvh] max-w-sm bg-white px-6 scrollbar-hide overflow-hidden"
          >
          <Routes />
          <CustomToast />
        </div>
      </div>
    </div>
  );
}

export default App;
