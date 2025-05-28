export interface CaffeineIntakeRequestDTO {
    drinkId: string;
    drinkSize: string;
    intakeTime: string;
    drinkCount: number;
    caffeineAmount: number;
  }

  export type UpdateCaffeineIntakeRequestDTO = Partial<CaffeineIntakeRequestDTO>;