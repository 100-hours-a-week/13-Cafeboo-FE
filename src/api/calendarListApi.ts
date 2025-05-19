import apiClient from '@/api/apiClient';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useQueryHooks } from '@/hooks/useQueryHooks';

// ✅ 일별 카페인 다이어리 조회 API 타입
export interface DailyIntakeEntry {
  intakeId: string;
  drinkId: string;
  drinkName: string;
  drinkCount: number;
  caffeineMg: number;
  intakeTime: string; 
}

export interface DailyCalendarResponse {
  filter: { date: string };
  totalCaffeineMg: number;
  intakeList: DailyIntakeEntry[];
}

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

// ✅ React Query 훅
export type UseDailyIntakeResult = UseQueryResult<DailyCalendarResponse, Error> & {
  showModal: boolean;
  setShowModal: (open: boolean) => void;
};

export const useDailyIntake = (
  date: string
): UseDailyIntakeResult => {
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

  const { showModal, setShowModal } = useQueryHooks(query);

  return { ...query, showModal, setShowModal };
};
