import { useState, useMemo } from 'react';
import PageLayout from '@/layout/PageLayout';
import { BarChart2, Plus, Info } from 'lucide-react';
import CaffeineCalendar from '@/components/diary/CaffeineCalendar';
import CaffeineList from '@/components/diary/CaffeineList';
import { useNavigate } from 'react-router-dom';
import CaffeineBottomSheet from '@/components/caffeine/CaffeineBottomSheet';
import type { CaffeineIntakeRequestDTO } from "@/api/caffeine/caffeine.dto";
import { useCalendar } from '@/api/diary/calendarApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { AlertTriangle } from "lucide-react";
import { useDailyIntake } from '@/api/diary/calendarListApi';
import { recordCaffeineIntake } from '@/api/caffeine/caffeineApi';
import AlertModal from '@/components/common/AlertModal';
import SectionCard from '@/components/common/SectionCard';
import { formatDate } from '@/utils/date';

const DiaryPage = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const { data: dataCanlendar, isLoading: loadingCalendar, isError: errorCalendar, error, refetch: refetchCalendar } = useCalendar(year, month);
  const { data: dataDaily, isLoading: loadingDaily, isError: errorDaily, error: dailyError, refetch: refetchDaily } = useDailyIntake(selectedDate);

  const caffeineData = useMemo(() => {
    const map: Record<string, number> = {};
    dataCanlendar?.dailyIntakeList.forEach(item => {
      map[item.date] = item.totalCaffeineMg;
    });
    return map;
  }, [dataCanlendar]);

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
    setSelectedDate(`${newYear}-${String(newMonth).padStart(2, '0')}-01`);
  };

  const handleEdit = (intakeId: string) => {
    const record = dataDaily?.intakeList.find(r => r.intakeId === intakeId);
    if (record) {
      navigate(`/main/diary/edit/${intakeId}`, { state: { record } });
    }
  };

  const handleSubmitRecord = async (record: CaffeineIntakeRequestDTO) => {
    try {
      await recordCaffeineIntake(record);
      refetchCalendar();
      refetchDaily();
    } catch (err: any) {
      console.error("카페인 섭취 등록 오류:", err.response?.data?.message || err.message);
      setAlertMessage(err.response?.data?.message || "카페인 등록에 실패했습니다.");
      setIsAlertOpen(true);       
    }
  };

  return (
    <PageLayout headerMode="logo">
        <SectionCard>
            <CaffeineCalendar
              year={year}
              month={month}
              selectedDate={selectedDate}
              caffeineData={caffeineData}
              onDateSelect={date => handleDateSelect(date)}
              onMonthChange={handleMonthChange}
            />
        </SectionCard>

        <h2 className="mt-6 mb-2 text-base text-[#000000] font-semibold">
          {new Date(selectedDate).getMonth() + 1}월{' '}
          {new Date(selectedDate).getDate()}일 카페인 기록
        </h2>

        {loadingDaily ? (
          <div className='item-center justify-center p-8'>
            <LoadingSpinner type="clip" size="small" fullScreen={false} />
          </div>
        ) : errorDaily ? (
          <EmptyState
            title="데이터 로딩 실패"
            description={(error as Error).message}
            icon={<AlertTriangle className="w-10 h-10" />}
          />
        ) : (
          <CaffeineList
            records={dataDaily?.intakeList ?? []}
            onEdit={handleEdit}
          />
        )}

        <button      
          className={"absolute bottom-18 right-5 w-12 h-12 cursor-pointer rounded-full bg-gray-500 text-white flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)]"}
          onClick={() => navigate('/main/report')}
        >
          <BarChart2 size={24} />
        </button>
        <button
          className={"absolute bottom-6 right-5 w-12 h-12 cursor-pointer rounded-full bg-[#FE9400] text-white flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)]"}
          onClick={() => setIsSheetOpen(true)}
        >
          <Plus size={24} />
        </button>

      <CaffeineBottomSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmitRecord={handleSubmitRecord}
        selectedDate={selectedDate}
      />
        <AlertModal
        isOpen={isAlertOpen}
        icon={<Info size={36} className="text-[#FE9400]" />}
        title="알림"
        message={alertMessage}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => setIsAlertOpen(false)}
        confirmText="확인"
        showCancelButton={false}
      />
    </PageLayout>
  );
};

export default DiaryPage;
