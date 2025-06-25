import apiClient from '@/api/apiClient';
import { createQueryHandler } from '@/utils/createQueryHandler';
import { DailyCalendarResponse } from '@/api/diary/calendar.dto';

// ✅ GET 요청
const fetchDailyIntake = async (
  date: string
): Promise<DailyCalendarResponse> => {
  const response = await apiClient.get('/api/v1/caffeine-intakes/daily', {
    params: { date },
  });

  return response.data;
};

export const useDailyIntake = (date: string) => {
  return createQueryHandler(
    ['dailyIntake', date],
    () => fetchDailyIntake(date),
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

