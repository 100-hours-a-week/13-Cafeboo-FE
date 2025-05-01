import Routes from '@/routes';
import './index.css';
import { useEffect } from 'react'
import { useDarkMode } from '@/stores/useDarkMode';
import { initializeTheme } from '@/stores/useThemeStore';

function App() {
  const { dark } = useDarkMode();

  useEffect(() => {
    initializeTheme();
  }, []);


  return (
    <div className="w-full max-w-full sm:max-w-md lg:max-w-3xl xl:max-w-7xl mx-auto px-4">
      <Routes />
    </div>
  );
}

export default App;
