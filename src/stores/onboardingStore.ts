import { create } from 'zustand';

export interface HealthInfo {
  gender:string;
  age: number;
  height: number;
  weight: number;
  isPregnant: boolean;
  isTakingBirthPill: boolean;
  isSmoking: boolean;
  hasLiverDisease: boolean;
}

export interface CaffeineInfo {
  caffeineSensitivity: number;
  averageDailyCaffeineIntake: number;
  userFavoriteDrinks: string[];
}

export interface SleepInfo {
  frequentDrinkTime: string;
  sleepTime: string;
  wakeUpTime: string;
}

export interface OnboardingState {
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

const defaultHealthInfo: HealthInfo = {
  gender: 'M',
  age: 20,
  height: 170,
  weight: 63.0,
  isPregnant: false,
  isTakingBirthPill: false,
  isSmoking: false,
  hasLiverDisease: false,
};

const defaultCaffeineInfo: CaffeineInfo = {
  caffeineSensitivity: 50,
  averageDailyCaffeineIntake: 1.5,
  userFavoriteDrinks: [],
};

const defaultSleepInfo: SleepInfo = {
  frequentDrinkTime: '12:00',
  sleepTime: '22:00',
  wakeUpTime: '07:00',
};

// Zustand Store 생성
export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  healthInfo: { ...defaultHealthInfo },
  caffeineInfo: { ...defaultCaffeineInfo },
  sleepInfo: { ...defaultSleepInfo },

  next: () => set((s) => ({ step: s.step + 1 })),
  back: () => set((s) => ({ step: Math.max(1, s.step - 1) })),

  // 상태 업데이트 (기본값 유지)
  updateHealth: (data) =>
    set((s) => ({
      healthInfo: { ...defaultHealthInfo, ...s.healthInfo, ...data },
    })),

  updateCaffeine: (data) =>
    set((s) => ({
      caffeineInfo: { ...defaultCaffeineInfo, ...s.caffeineInfo, ...data },
    })),

  updateSleep: (data) =>
    set((s) => ({
      sleepInfo: { ...defaultSleepInfo, ...s.sleepInfo, ...data },
    })),

  // 상태 초기화 (기본값 유지)
  reset: () =>
    set({
      step: 1,
      healthInfo: { ...defaultHealthInfo },
      caffeineInfo: { ...defaultCaffeineInfo },
      sleepInfo: { ...defaultSleepInfo },
    }),
}));

