import { useEffect, useState, useMemo } from 'react';
import Header from '@/components/common/Header';
import { BarChart2, Plus, Info } from 'lucide-react';
import CaffeineCalendar from '@/components/diary/CaffeineCalendar';
import CaffeineList from '@/components/diary/CaffeineList';
import { useNavigate } from 'react-router-dom';
import CaffeineBottomSheet from '@/components/caffeine/CaffeineBottomSheet';
import type { CaffeineRecordInput } from '@/components/caffeine/CaffeineDetailForm';
import { useCalendar } from '@/api/calendarApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { AlertTriangle } from "lucide-react";
import { useDailyIntake } from '@/api/calendarListApi';
import { recordCaffeineIntake } from '@/api/caffeineApi';
import AlertModal from '@/components/common/AlertModal';

// 날짜 포맷 유틸
const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const DiaryPage = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLarge, setIsLarge] = useState(window.innerWidth >= 450 && window.innerWidth < 1024);
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

  const records = useMemo(() => {
    return dataDaily?.intakeList.map(entry => ({
      intakeId: entry.intakeId,
      drinkId: entry.drinkId,
      drinkName: entry.drinkName,
      drinkCount: entry.drinkCount,
      caffeineAmount: entry.caffeineMg,
      intakeTime: entry.intakeTime.slice(11,16),
    })) ?? [];
  }, [dataDaily]);

  useEffect(() => {
    const handleResize = () => {
      setIsLarge(window.innerWidth >= 450);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
    setSelectedDate(`${newYear}-${String(newMonth).padStart(2, '0')}-01`);
  };

  const handleEdit = (intakeId: string) => {
    const record = records.find(r => r.intakeId === intakeId);
    if (record) {
      navigate(`/main/diary/edit/${intakeId}`, { state: {record} });
    }
  };

  const handleSubmitRecord = async (record: CaffeineRecordInput) => {
    try {
      const response = await recordCaffeineIntake({
        drinkId: record.drinkId.toString(),
        drinkSize: record.drinkSize,
        intakeTime: record.intakeTime,
        drinkCount: record.drinkCount,
        caffeineAmount: Number(record.caffeineAmount.toFixed(1)), 
      });
      console.log("카페인 섭취 등록 성공:", response);
      refetchCalendar();
      refetchDaily();
    } catch (err: any) {
      console.error("카페인 섭취 등록 오류:", err.response?.data?.message || err.message);
      setAlertMessage(err.response?.data?.message || "카페인 등록에 실패했습니다.");
      setIsAlertOpen(true);   
    }
  };

  return (
    <div className="min-h-screen">
      <Header mode="logo" />
      <main className="pt-16 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full mx-auto">
              <CaffeineCalendar
              year={year}
              month={month}
              selectedDate={selectedDate}
              caffeineData={caffeineData}
              onDateSelect={date => handleDateSelect(date)}
              onMonthChange={handleMonthChange}
            />
            )
        </div>

        <h2 className="mt-6 mb-3 text-base text-[#000000] font-semibold">
          {new Date(selectedDate).getMonth() + 1}월{' '}
          {new Date(selectedDate).getDate()}일 카페인 기록
        </h2>

        {loadingDaily ? (
           <LoadingSpinner type="clip" size="small" fullScreen={false} />
        ) : errorDaily ? (
          <EmptyState
            title="데이터 로딩 실패"
            description={(error as Error).message}
            icon={<AlertTriangle className="w-10 h-10 text-[#D1D1D1]" />}
          />
        ) : (
          <CaffeineList records={records} onEdit={handleEdit} />
        )}

        <button
          className={`fixed bottom-18 ${isLarge? 'right-[calc(50%_-_225px_+_20px)]' : 'right-5'} w-12 h-12 cursor-pointer rounded-full bg-[#545F71] text-white flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)] lg:left-224 xl:left-288 2xl:left-352`}
          onClick={() => navigate('/main/report')}
        >
          <BarChart2 size={24} />
        </button>
        <button
          className={`fixed bottom-6 ${isLarge? 'right-[calc(50%_-_225px_+_20px)]' : 'right-5'} w-12 h-12 cursor-pointer rounded-full bg-[#FE9400] text-white flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)] lg:left-224 xl:left-288 2xl:left-352`}
          onClick={() => setIsSheetOpen(true)}
          >
          <Plus size={24} />
        </button>
      </main>
      <CaffeineBottomSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmitRecord={handleSubmitRecord}
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
    </div>
  );
};

export default DiaryPage;
