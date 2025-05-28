export interface HourlyCaffeineData {
    time: string;          
    caffeineMg: number;   
  }
  
  export interface DailyCaffeineReportResponse {
    nickname: string;
    dailyCaffeineLimit: number;
    dailyCaffeineIntakeMg: number;
    dailyCaffeineIntakeRate: number;    
    intakeGuide: string;
    sleepSensitiveThreshold: number;
    caffeineByHour: HourlyCaffeineData[];
  }