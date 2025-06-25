import apiClient from '@/api/apiClient';
import { createQueryHandler } from '@/utils/createQueryHandler';
import type { WeeklyReportDTO } from '@/api/report/report.dto';

// ✅ GET 요청
const fetchWeeklyReport = async (
  year: string,
  month: string,
  week: string
): Promise<WeeklyReportDTO> => {
  const response = await apiClient.get('/api/v1/reports/weekly', {
    params: { year, month, week },
  });
  return response.data;
};

export const useWeeklyReport = (
  year: string,
  month: string,
  week: string
) => {
  return createQueryHandler(
    ['weeklyReport', year, month, week],
    () => fetchWeeklyReport(year, month, week),
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

