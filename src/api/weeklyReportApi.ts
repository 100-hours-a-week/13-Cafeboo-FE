import apiClient from '@/api/apiClient';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useQueryHooks } from '@/hooks/useQueryHooks';

export interface WeeklyReportData {
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
  dailyIntakeTotals: {
    date: string;
    caffeineMg: number;
  }[];
  aiMessage: string;
}

export interface WeeklyReportResponse {
  status: number;
  code: string;
  message: string;
  data: WeeklyReportData;
}

export const fetchWeeklyReport = async (
  year: string,
  month: string,
  week: string
): Promise<WeeklyReportData> => {
  const response = await apiClient.get<WeeklyReportResponse>(
    `/api/v1/reports/weekly`,
    { params: { year, month, week } }
  );
  return response.data.data;
};

export const useWeeklyReport = (
  year: string,
  month: string,
  week: string
): UseQueryResult<WeeklyReportData, Error> & {
  showModal: boolean;
  setShowModal: (open: boolean) => void;
} => {
  const yearStr = year;
  const monthStr = month;

  const query = useQuery<WeeklyReportData, Error>({
    queryKey: ['weeklyReport', yearStr, monthStr, week],
    queryFn: () => fetchWeeklyReport(yearStr, monthStr, week),
    staleTime: 30000,                
    gcTime: 60000,        
    refetchInterval: 30000,      
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
  });

  const { showModal, setShowModal } = useQueryHooks(query);

  return {
    ...query,
    showModal,
    setShowModal,
  };
};
