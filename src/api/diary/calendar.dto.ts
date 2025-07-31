export interface DailyIntake {
  date: string;
  totalCaffeineMg: number;
}

export interface MonthlyCalendarFilter {
  year: string;
  month: string;
}

export interface MonthlyCalendarResponse {
  filter: MonthlyCalendarFilter;
  dailyIntakeList: DailyIntake[];
}

export interface DailyIntakeDetail {
  intakeId: string;
  drinkId: string;
  drinkName: string;
  drinkCount: number;
  caffeineMg: number;
  intakeTime: string;
}

export interface DailyCalendarFilter {
  date: string;
}

export interface DailyCalendarResponse {
  filter: DailyCalendarFilter;
  totalCaffeineMg: number;
  intakeList: DailyIntakeDetail[];
}
