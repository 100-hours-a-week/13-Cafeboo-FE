import apiClient from '@/api/apiClient';
import { createQueryHandler } from '@/utils/createQueryHandler';
import { YearlyReportDTO } from '@/api/report/report.dto';

// ✅ GET 요청
const fetchYearlyReport = async (
  year: string
): Promise<YearlyReportDTO> => {
  const response = await apiClient.get('/api/v1/reports/yearly', {
    params: { year },
  });
  return response.data.data;
};

export const useYearlyReport = (year: string) => {
  return createQueryHandler(
    ['yearlyReport', year],
    () => fetchYearlyReport(year),
    {
      staleTime: 60000,
      gcTime: 300000,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
    }
  );
};
