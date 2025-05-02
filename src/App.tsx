import Routes from '@/routes';
import './index.css';
import { useEffect } from 'react';
import { useDarkMode } from '@/stores/useDarkMode';

function App() {
  const { dark } = useDarkMode();
  
  useEffect(() => {
    // 초기 로드 시 다크모드 클래스 적용
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <div className="w-full max-w-full sm:max-w-md lg:max-w-3xl xl:max-w-7xl mx-auto px-4 overflow-x-hidden">
      <Routes />
    </div>
  );
}

export default App;
