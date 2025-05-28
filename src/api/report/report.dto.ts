export interface DailyCaffeineTotalDTO {
    date: string;
    caffeineMg: number;
}

export interface WeeklyReportDTO {
    filter: {
        year: string;
        month: string;
        week: string;
    };
    isoWeek: string;
    startDate: string;
    endDate: string;
    weeklyCaffeineTotal: number;
    dailyCaffeineLimit: number;
    overLimitDays: number;
    dailyCaffeineAvg: number;
    dailyIntakeTotals: DailyCaffeineTotalDTO[];
    aiMessage: string;
}

export interface MonthlyReportDTO {
    filter: {
      year: string;
      month: string;
    };
    startDate: string;
    endDate: string;
    monthlyCaffeineTotal: number;
    weeklyCaffeineAvg: number;
    weeklyIntakeTotals: {
      isoWeek: string;
      totalCaffeineMg: number;
    }[];
}

export interface YearlyReportDTO {
    filter: {
        year: string;
    };
    startDate: string;
    endDate: string;
    yearlyCaffeineTotal: number;
    monthlyCaffeineAvg: number;
    monthlyIntakeTotals: {
        month: number;
        totalCaffeineMg: number;
    }[];
}
  