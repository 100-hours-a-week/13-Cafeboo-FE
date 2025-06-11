import apiClient from '@/api/apiClient';
import { getUserIdFromStore } from '@/utils/auth';
import { createQueryHandler } from '@/utils/createQueryHandler'; 
import { MonthlyCalendarResponse } from '@/api/diary/calendar.dto';

// ✅ GET 요청
const fetchCalendar = async (
  year: string,
  month: string
): Promise<MonthlyCalendarResponse> => {
  const response = await apiClient.get('/api/v1/caffeine-intakes/monthly', {
    params: { year, month },
  });

  return response.data;
};

export const useCalendar = (
  year: number,
  month: number
) => {
  const yearStr = String(year);
  const monthStr = String(month);

  return createQueryHandler(
    ['calendar', yearStr, monthStr],
    () => fetchCalendar(yearStr, monthStr),
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

