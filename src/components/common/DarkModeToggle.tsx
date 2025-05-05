import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/stores/useDarkMode';

const DarkModeToggle = () => {
  // 다크모드 상태와 토글 함수 가져오기
  const { dark, toggleDark } = useDarkMode();

  // 다크모드에 따른 텍스트 색상
  const textColor = dark ? '#F5F5F5' : '#543122';

  return (
    <button
      onClick={toggleDark}
      className="p-2 rounded-full hover:opacity-80"
      aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      style={{ color: textColor }}
    >
      {dark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

export default DarkModeToggle;