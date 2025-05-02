import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DarkModeStore = {
  dark: boolean;
  toggleDark: () => void;
};

export const useDarkMode = create<DarkModeStore>()(
  persist(
    (set, get) => ({
      dark: window.matchMedia('(prefers-color-scheme: dark)').matches,
      toggleDark: () => {
        const next = !get().dark;
        set({ dark: next });
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }),
    {
      name: 'dark-mode-storage',
    }
  )
);
