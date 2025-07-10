import { create } from "zustand";
import { requestKakaoLogin } from "@/api/auth/authApi";

interface AuthStore {
  userId: string | null;
  role: "GUEST" | "USER" | null;
  guestTokenExpiry: string | null; 

  setAuth: (
    id: string,
    role: "GUEST" | "USER",
    guestTokenExpiry?: string | null
  ) => void;
  clearAuth: () => void;

  kakaoLogin: () => Promise<void>;

  isGuestTokenValid: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  userId:
    typeof window !== "undefined" ? localStorage.getItem("userId") : null,
  role:
    typeof window !== "undefined"
      ? (localStorage.getItem("role") as "GUEST" | "USER" | null)
      : null,
  guestTokenExpiry:
    typeof window !== "undefined"
      ? localStorage.getItem("access_token_expiry")
      : null,

  setAuth: (id, role, guestTokenExpiry = null) => {
    localStorage.setItem("userId", id);
    localStorage.setItem("role", role);
    if (guestTokenExpiry) {
      localStorage.setItem("access_token_expiry", guestTokenExpiry);
    } else {
      localStorage.removeItem("access_token_expiry");
    }
    set({ userId: id, role, guestTokenExpiry });
  },

  clearAuth: () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("access_token_expiry");
    set({ userId: null, role: null, guestTokenExpiry: null });
  },

  kakaoLogin: async () => {
    await requestKakaoLogin();
  },

  isGuestTokenValid: () => {
    const role = get().role;
    const expiry = get().guestTokenExpiry;

    if (role !== "GUEST") {
      return true;
    }
    if (!expiry) return false;

    const todayStr = new Date().toISOString().slice(0, 10);
    return expiry === todayStr;
  },
}));
