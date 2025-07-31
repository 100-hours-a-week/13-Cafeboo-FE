export interface CaffeineInfoResponseDTO {
  caffeineSensitivity: number;
  averageDailyCaffeineIntake: number;
  frequentDrinkTime: string;
  dailyCaffeineLimitMg: number;
  sleepSensitiveThresholdMg: number;
  userFavoriteDrinks: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CaffeineInfoRequestDTO {
  caffeineSensitivity: number;
  averageDailyCaffeineIntake: number;
  frequentDrinkTime: string;
  userFavoriteDrinks: string[];
}

export interface CaffeineIntakeRequestDTO {
  drinkId: string;
  drinkSize: string;
  intakeTime: string;
  drinkCount: number;
  caffeineAmount: number;
}

export type UpdateCaffeineInfoRequestDTO = Partial<CaffeineInfoRequestDTO>;
export type UpdateCaffeineIntakeRequestDTO = Partial<CaffeineIntakeRequestDTO>;
