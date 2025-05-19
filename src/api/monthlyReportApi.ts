import apiClient from '@/api/apiClient';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useQueryHooks } from '@/hooks/useQueryHooks';


export interface MonthlyReportData {
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

export interface MonthlyReportResponse {
  status: number;
  code: string;
  message: string;
  data: MonthlyReportData;
}

export const fetchMonthlyReport = async (
  year: string,
  month: string
): Promise<MonthlyReportData> => {
  const response = await apiClient.get<MonthlyReportResponse>(
    `/api/v1/reports/monthly`,
    { params: { year, month } }
  );
  return response.data.data;
};

export const useMonthlyReport = (
  year: string,
  month: string
): UseQueryResult<MonthlyReportData, Error> & {
  showModal: boolean;
  setShowModal: (open: boolean) => void;
} => {
  const yearStr = year;
  const monthStr = month;

  const query = useQuery<MonthlyReportData, Error>({
    queryKey: ['monthlyReport', yearStr, monthStr],
    queryFn: () => fetchMonthlyReport(yearStr, monthStr),
    staleTime: 60000,                
    gcTime: 300000,    
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
