import { create } from 'zustand';

interface HealthInfo {
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  pregnancy?: boolean;
  birthControl?: boolean;
  smoking?: boolean;
  liverDisease?: boolean;
}

interface CaffeineInfo {
  caffeineSensitivity?: number;
  dailyIntake?: number;
  userFavoriteDrinks?: string[];
}

interface SleepInfo {
  caffeineIntakeTime?: string;
  sleepStartTime?: string;
  sleepEndTime?: string;
}

interface OnboardingState {
  step: number;
  healthInfo: HealthInfo;
  caffeineInfo: CaffeineInfo;
  sleepInfo: SleepInfo;
  next: () => void;
  back: () => void;
  updateHealth: (data: Partial<HealthInfo>) => void;
  updateCaffeine: (data: Partial<CaffeineInfo>) => void;
  updateSleep: (data: Partial<SleepInfo>) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  healthInfo: {},
  caffeineInfo: {},
  sleepInfo: {},
  next: () => set((s) => ({ step: s.step + 1 })),
  back: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
  updateHealth: (data) =>
    set((s) => ({ healthInfo: { ...s.healthInfo, ...data } })),
  updateCaffeine: (data) =>
    set((s) => ({ caffeineInfo: { ...s.caffeineInfo, ...data } })),
  updateSleep: (data) =>
    set((s) => ({ sleepInfo: { ...s.sleepInfo, ...data } })),
  reset: () =>
    set({
      step: 1,
      healthInfo: {},
      caffeineInfo: {},
      sleepInfo: {},
    }),
}));
