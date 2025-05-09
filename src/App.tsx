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
      className="min-h-screen flex items-center justify-start bg-orange-100"
    >
      <div className="pl-0 xs:pl-26 sm:pl-30 md:pl-64 lg:pl-128 xl:pl-192 2xl:pl-256">
        <div className="relative w-screen w-full h-full max-w-md bg-white overflow-y-auto overflow-x-hidden px-4 scrollbar-hide">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default App;
