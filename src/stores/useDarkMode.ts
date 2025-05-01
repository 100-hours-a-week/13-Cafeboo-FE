import { create } from 'zustand';

type DarkModeStore = {
  dark: boolean;
  toggleDark: () => void;
};

export const useDarkMode = create<DarkModeStore>((set, get) => ({
  dark: false,
  toggleDark: () => {
    const next = !get().dark;
    set({ dark: next });
    document.documentElement.classList.toggle('dark', next); 
  },
}));
