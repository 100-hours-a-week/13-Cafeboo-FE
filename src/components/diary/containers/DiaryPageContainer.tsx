import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '@/api/diary/calendarApi';
import { useDailyIntake } from '@/api/diary/calendarListApi';
import { recordCaffeineIntake } from '@/api/caffeine/caffeineApi';
import DiaryPageUI from '@/components/diary/DiaryPageUI';
import type { CaffeineIntakeRequestDTO } from '@/api/caffeine/caffeine.dto';

export default function DiaryPageContainer() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const {
    data: dataCalendar,
    isLoading: isCalendarLoading,
    isError: isCalendarError,
    error: calendarError,
    refetch: refetchCalendar,
  } = useCalendar(year, month);

  const {
    data: dataDaily,
    isLoading: isDailyLoading,
    isError: isDailyError,
    error: dailyError,
    refetch: refetchDaily,
  } = useDailyIntake(selectedDate);

  const caffeineData = useMemo(() => {
    const map: Record<string, number> = {};
    dataCalendar?.dailyIntakeList.forEach((item) => {
      map[item.date] = item.totalCaffeineMg;
    });
    return map;
  }, [dataCalendar]);

  const handleMainClick = () => {
    navigate('/main/report');
  };

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
    setSelectedDate(`${newYear}-${String(newMonth).padStart(2, '0')}-01`);
  };

  const handleEdit = (intakeId: string) => {
    const record = dataDaily?.intakeList.find((r) => r.intakeId === intakeId);
    if (record) {
      navigate(`/main/diary/edit/${intakeId}`, { state: { record } });
    }
  };

  const handleSubmitRecord = async (record: CaffeineIntakeRequestDTO) => {
    try {
      await recordCaffeineIntake(record);
      refetchCalendar();
      refetchDaily();
    } catch (error: any) {
      console.error('카페인 섭취 등록 오류:' + `${error.status}(${error.code}) - ${error.message}`);
      setAlertMessage(error.message || '카페인 등록에 실패했습니다.');
      setIsAlertOpen(true);
    }
  };

  // 상태 묶음
  const calendarStatus = {
    isLoading: isCalendarLoading,
    isError: isCalendarError,
    error: calendarError,
  };

  const dailyStatus = {
    isLoading: isDailyLoading,
    isError: isDailyError,
    error: dailyError,
  };

  // 핸들러 묶음
  const handlers = {
    onMainClick:handleMainClick,
    onDateSelect: handleDateSelect,
    onMonthChange: handleMonthChange,
    onEdit: handleEdit,
    onSubmitRecord: handleSubmitRecord,
  };

  return (
    <DiaryPageUI
      year={year}
      month={month}
      selectedDate={selectedDate}
      caffeineData={caffeineData ?? {}}
      dataDaily={dataDaily}
      calendarStatus={calendarStatus}
      dailyStatus={dailyStatus}
      isSheetOpen={isSheetOpen}
      setIsSheetOpen={setIsSheetOpen}
      isAlertOpen={isAlertOpen}
      setIsAlertOpen={setIsAlertOpen}
      alertMessage={alertMessage}
      handlers={handlers}
    />
  );
}
