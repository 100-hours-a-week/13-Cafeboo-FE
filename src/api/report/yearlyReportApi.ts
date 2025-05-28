import apiClient from '@/api/apiClient';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useQueryHooks } from '@/hooks/useQueryHooks';
import { YearlyReportDTO } from '@/api/report/report.dto';

export const fetchYearlyReport = async (
  year: string
): Promise<YearlyReportDTO> => {
  const response = await apiClient.get(`/api/v1/reports/yearly`, {
    params: { year },
  });
  return response.data.data;
};

export const useYearlyReport = (
  year: string
): UseQueryResult<YearlyReportDTO, Error> & {
  showModal: boolean;
  setShowModal: (open: boolean) => void;
} => {
  const yearStr = year;

  const query = useQuery<YearlyReportDTO, Error>({
    queryKey: ['yearlyReport', yearStr],
    queryFn: () => fetchYearlyReport(yearStr),
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
