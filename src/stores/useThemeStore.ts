import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const COLORS = {
  light: {
    bg: '#FEFBF8',
    btnText: '#FEFBF8',
    comp: '#FFFFFF',
    primary: '#8C593D',
    text: '#56433C',
    content: '#595959',
    sub: '#939393',
    border: '#C7B39C',
  },
  
  dark: {
    bg: '#121212',
    btnText: '#F5F5F5',
    comp: '#2C2C2C',
    primary: '#8B522B',
    text: '#F5F5F5',
    content: '#D1D1D1',
    sub: '#AAAAAA',
    border: '#C7B39C',
  }
};

export type ColorKeys = keyof typeof COLORS.light;

// 테마 스토어 타입 정의
type ThemeStore = {
  dark: boolean;
  toggleDark: () => void;
  colors: typeof COLORS.light;
  getColor: (colorName: ColorKeys) => string;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      dark: typeof window !== 'undefined' 
        ? window.matchMedia?.('(prefers-color-scheme: dark)').matches || false
        : false,
      
      toggleDark: () => {
        const next = !get().dark;
        set({ dark: next });
        
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', next);
        }
      },
      
      get colors() {
        return get().dark ? COLORS.dark : COLORS.light;
      },
      
      getColor: (colorName: ColorKeys) => {
        return get().dark ? COLORS.dark[colorName] : COLORS.light[colorName];
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ dark: state.dark }), 
    }
  )
);

// 앱 초기화 시 다크모드 클래스 적용 함수
export const initializeTheme = () => {
  const { dark } = useThemeStore.getState();
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', dark);
  }
};