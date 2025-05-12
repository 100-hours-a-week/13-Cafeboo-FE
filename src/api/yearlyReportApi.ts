import apiClient from '@/api/apiClient';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useQueryHooks } from '@/hooks/useQueryHooks';

export interface YearlyReportData {
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

export interface YearlyReportResponse {
  status: number;
  code: string;
  message: string;
  data: YearlyReportData;
}

export const fetchYearlyReport = async (
  year: string
): Promise<YearlyReportData> => {
  const response = await apiClient.get<YearlyReportResponse>(
    `/api/v1/reports/yearly`,
    { params: { year } }
  );
  return response.data.data;
};

export const useYearlyReport = (
  year: string
): UseQueryResult<YearlyReportData, Error> & {
  showModal: boolean;
  setShowModal: (open: boolean) => void;
} => {
  const yearStr = year;

  const query = useQuery<YearlyReportData, Error>({
    queryKey: ['yearlyReport', yearStr],
    queryFn: () => fetchYearlyReport(yearStr),
    staleTime: 300_000,
    gcTime: 600_000,
    refetchInterval: 300_000,
    refetchOnMount: true,
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
