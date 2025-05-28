import apiClient from '@/api/apiClient';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useQueryHooks } from '@/hooks/useQueryHooks';
import type { WeeklyReportDTO } from '@/api/report/report.dto';

export const fetchWeeklyReport = async (
  year: string,
  month: string,
  week: string
): Promise<WeeklyReportDTO> => {
  const response = await apiClient.get(`/api/v1/reports/weekly`, {
    params: { year, month, week },
  });
  return response.data.data;
};

export const useWeeklyReport = (
  year: string,
  month: string,
  week: string
): UseQueryResult<WeeklyReportDTO, Error> & {
  showModal: boolean;
  setShowModal: (open: boolean) => void;
} => {
  const yearStr = year;
  const monthStr = month;

  const query = useQuery<WeeklyReportDTO, Error>({
    queryKey: ['weeklyReport', yearStr, monthStr, week],
    queryFn: () => fetchWeeklyReport(yearStr, monthStr, week),
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
