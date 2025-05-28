import apiClient from '@/api/apiClient';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useQueryHooks } from '@/hooks/useQueryHooks';
import { DailyCalendarResponse } from '@/api/diary/calendar.dto';

// ✅ 일별 카페인 다이어리 조회 함수
export const fetchDailyIntake = async (
  date: string
): Promise<DailyCalendarResponse> => {
  const userId = localStorage.getItem('userId');
  if (!userId) throw new Error('사용자 정보가 없습니다.');

  const response = await apiClient.get(
    `/api/v1/caffeine-intakes/daily`,
    { params: { date } }
  );

  return response.data.data;
};

export const useDailyIntake = (date: string) => {
  const query = useQuery<DailyCalendarResponse, Error>({
    queryKey: ['dailyIntake', date],
    queryFn: () => fetchDailyIntake(date),
    staleTime: 60000,
    gcTime: 300000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
  });

  return {
    ...query,
    ...useQueryHooks(query),
  };
};
