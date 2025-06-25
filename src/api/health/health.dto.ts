export interface HealthInfoResponseDTO {
    gender:string;
    age: number;
    height: number;
    weight: number;
    pregnant: boolean;
    taking_birth_pill: boolean;
    smoking: boolean;
    has_liver_disease: boolean;
    sleep_time: string;
    wake_up_time: string;
    createdAt?: string;
    updatedAt?: string;
}
  
export interface HealthInfoRequestDTO {
    gender:string;
    age: number;
    height: number;
    weight: number;
    isPregnant: boolean;
    isTakingBirthPill: boolean;
    isSmoking: boolean;
    hasLiverDisease: boolean;
    sleepTime: string;
    wakeUpTime: string;
}
  
export type UpdateHealthInfoRequestDTO = Partial<HealthInfoRequestDTO>;