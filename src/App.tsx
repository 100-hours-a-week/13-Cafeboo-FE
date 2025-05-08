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
    <div ref={layoutRef} className="w-full max-w-md mx-auto px-4 overflow-x-hidden">
      <Routes />
    </div>
  );
}

export default App;
