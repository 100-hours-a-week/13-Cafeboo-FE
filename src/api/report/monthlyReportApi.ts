import apiClient from '@/api/apiClient';
import { createQueryHandler } from '@/utils/createQueryHandler';
import { MonthlyReportDTO } from '@/api/report/report.dto';

// ✅ GET 요청
const fetchMonthlyReport = async (
  year: string,
  month: string
): Promise<MonthlyReportDTO> => {
  const response = await apiClient.get('/api/v1/reports/monthly', {
    params: { year, month },
  });
  return response.data;
};

export const useMonthlyReport = (year: string, month: string) => {
  return createQueryHandler(
    ['monthlyReport', year, month],
    () => fetchMonthlyReport(year, month),
    {
      staleTime: 60000,
      gcTime: 300000,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    }
  );
};
