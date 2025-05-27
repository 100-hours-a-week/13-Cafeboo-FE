import apiClient from '@/api/apiClient';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useQueryHooks } from '@/hooks/useQueryHooks';

// ✅ API 호출 결과 타입 그대로 반환
export interface RawDailyIntake {
  date: string;           
  totalCaffeineMg: number;
}

export interface MonthlyCalendarResponse {
  filter: { year: string; month: string };
  dailyIntakeList: RawDailyIntake[];
}

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

// ✅ React Query 훅 사용 결과 타입
export type UseCalendarResult = UseQueryResult<MonthlyCalendarResponse, Error> & {
  showModal: boolean;
  setShowModal: (open: boolean) => void;
};

// ✅ React Query 훅: 원본 데이터를 페이지에서 가공 없이 반환
export const useCalendar = (
  year: number,
  month: number
): UseCalendarResult => {
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

  const { showModal, setShowModal } = useQueryHooks(query);

  return {
    ...query,
    showModal,
    setShowModal,
  };
};
