import Routes from '@/routes';
import './index.css';
import { useEffect, useRef } from 'react';

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
      className="min-h-screen flex items-center justify-start bg-[#FE9400]/10"
    >
      <div className="mx-auto lg:ml-128 xl:ml-192 2xl:ml-256">
        <div className="relative w-screen w-full h-full max-w-md bg-white overflow-y-auto overflow-x-hidden px-4 scrollbar-hide">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default App;
