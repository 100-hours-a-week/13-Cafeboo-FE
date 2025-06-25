import { create } from 'zustand';

type ToastType = 'success' | 'error';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  showToast: (type: ToastType, message: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'success',
  showToast: (type, message) => {
    set({ visible: true, message, type });
    setTimeout(() => set({ visible: false }), 2000);
  },
  hideToast: () => set({ visible: false }),
}));
