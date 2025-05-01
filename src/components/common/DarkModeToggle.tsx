import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';

const DarkModeToggle = () => {
  const { dark, toggleDark } = useThemeStore();

  // 조건부 Tailwind 클래스
  const textColorClass = dark ? 'text-[#F5F5F5]' : 'text-[#FEFBF8]';

  return (
    <button
      onClick={toggleDark}
      className={`p-2 rounded-full hover:opacity-80 ${textColorClass}`}
      aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
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