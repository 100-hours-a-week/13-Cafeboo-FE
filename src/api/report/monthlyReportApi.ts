import apiClient from '@/api/apiClient';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useQueryHooks } from '@/hooks/useQueryHooks';
import { MonthlyReportDTO } from '@/api/report/report.dto';

export const fetchMonthlyReport = async (
  year: string,
  month: string
): Promise<MonthlyReportDTO> => {
  const response = await apiClient.get(`/api/v1/reports/monthly`, {
    params: { year, month },
  });
  return response.data.data;
};

export const useMonthlyReport = (
  year: string,
  month: string
): UseQueryResult<MonthlyReportDTO, Error> & {
  showModal: boolean;
  setShowModal: (open: boolean) => void;
} => {
  const yearStr = year;
  const monthStr = month;

  const query = useQuery<MonthlyReportDTO, Error>({
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
