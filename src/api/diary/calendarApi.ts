import apiClient from '@/api/apiClient';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useQueryHooks } from '@/hooks/useQueryHooks';
import { MonthlyCalendarResponse } from '@/api/diary/calendar.dto'; 

// ✅ 월별 카페인 다이어리 캘린더 조회 API 
export const fetchCalendar = async (
  year: string,
  month: string
): Promise<MonthlyCalendarResponse> => {
  const userId = localStorage.getItem('userId');
  if (!userId) throw new Error('사용자 정보가 없습니다.');

  const response = await apiClient.get(
    `/api/v1/caffeine-intakes/monthly`,
    { params: { year, month } }
  );

  return response.data.data;
};

export const useCalendar = (
  year: number,
  month: number
) => {
  const yearStr = String(year);
  const monthStr = String(month);

  const query = useQuery<MonthlyCalendarResponse, Error>({
    queryKey: ['calendar', yearStr, monthStr],
    queryFn: () => fetchCalendar(yearStr, monthStr),
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
  } as const;
};
