export interface HealthInfoResponseDTO {
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