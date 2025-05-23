import Routes from '@/routes';
import './index.css';
import { useEffect, useRef } from 'react';
import Logo from '@/assets/logo.svg';
import Icon from '@/assets/cute_coffee_favicon_128.ico'
import BG from '@/assets/background.png'

function App() {
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--vh',
      `${window.screen.height}px`
    );
  }, []);

  return (
    <div
      ref={layoutRef}
      className="min-h-screen flex items-center justify-start"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundRepeat: 'repeat',
        backgroundPosition: 'top left',
        backgroundSize: 'auto',
      }}
    >
      <div className="fixed my-auto xl:ml-30 2xl:left-50 p-8 hidden lg:flex flex-col items-center justify-center">
        <div className="flex items-center justify-center">
          <img src={Icon} alt="CafeBoo Logo" className="h-28 w-auto mb-6"/>
          <img src={Logo} alt="Cafeboo" className="h-28 w-auto"/>
        </div>
        <div className="text-xl font-semibold items-center justify-center">
          일상의 카페인을 기록해보세요!
        </div>
      </div>
      <div className="mx-auto lg:ml-128 xl:ml-192 2xl:ml-256">
        <div className="relative w-screen w-full h-full max-w-md bg-white overflow-y-auto overflow-x-hidden px-4 scrollbar-hide">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default App;
