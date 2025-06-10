import { create } from "zustand";

interface UserStore {
  userId: string | null;
  setUserId: (id: string) => void;
  clearUserId: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  // 최초 1회만 localStorage에서 userId를 읽어옴
  userId: typeof window !== "undefined" ? localStorage.getItem("userId") : null,

  // 로그인 시 userId 저장
  setUserId: (id) => {
    localStorage.setItem("userId", id);
    set({ userId: id });
  },

  // 로그아웃 또는 초기화 시
  clearUserId: () => {
    localStorage.removeItem("userId");
    set({ userId: null });
  },
}));
