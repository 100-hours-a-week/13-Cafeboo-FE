import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import { Calendar, Plus, AlertTriangle, Info } from 'lucide-react';
import DropdownSelector, { PeriodType } from '@/components/report/DropdownSelector';
import PeriodFilterSelector from '@/components/report/PeriodFilterSelector';
import ReportChart from '@/components/report/ReportChart';
import ReportSummary from '@/components/report/ReportSummary';
import ReportMessage from '@/components/report/ReportMessage';
import { useNavigate } from 'react-router-dom';
import CaffeineBottomSheet from '@/components/caffeine/CaffeineBottomSheet';
import type { CaffeineRecordInput } from '@/components/caffeine/CaffeineDetailForm';
import { useWeeklyReport } from '@/api/weeklyReportApi';
import { useMonthlyReport } from '@/api/monthlyReportApi';
import { useYearlyReport } from '@/api/yearlyReportApi';
import { recordCaffeineIntake } from '@/api/caffeineApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import AlertModal from '@/components/common/AlertModal';

interface ReportApiData {
  // 주간
  dailyIntakeTotals?: { date: string; caffeineMg: number }[];
  dailyCaffeineLimit?: number;
  dailyCaffeineAvg?: number;
  overLimitDays?: number;
  aiMessage?: string;
  // 월간
  weeklyIntakeTotals?: { isoWeek: string; totalCaffeineMg: number }[];
  // 연간
  monthlyIntakeTotals?: { month: number; totalCaffeineMg: number }[];
}

export default function ReportPage() {
  const navigate = useNavigate();

  // 오늘을 기준으로 기본 필터 설정
  const today = new Date();
  const defaultYear = String(today.getFullYear());
  const defaultMonth = String(today.getMonth() + 1);
  const defaultWeek = `${Math.ceil(today.getDate() / 7)}`;

  const [periodType, setPeriodType] = useState<PeriodType>('weekly');
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedWeek, setSelectedWeek] = useState(defaultWeek);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLarge, setIsLarge] = useState(window.innerWidth >= 450 && window.innerWidth < 1024);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 주간/월간/연간 API 훅
  const {
    data: weeklyData,
    isLoading: loadingWeekly,
    isError: errorWeekly,
    error: weeklyError,
    refetch: refetchWeekly
  } = useWeeklyReport(selectedYear, selectedMonth, selectedWeek);

  const {
    data: monthlyData,
    isLoading: loadingMonthly,
    isError: errorMonthly,
    error: monthlyError,
    refetch: refetchMonthly
  } = useMonthlyReport(selectedYear, selectedMonth);

  const {
    data: yearlyData,
    isLoading: loadingYearly,
    isError: errorYearly,
    error: yearlyError,
    refetch: refetchYearly
  } = useYearlyReport(selectedYear);

  // 화면에 넘겨줄 공통 데이터 구조로 매핑
  const reportData: ReportApiData = periodType === 'weekly'
    ? {
        dailyIntakeTotals: weeklyData?.dailyIntakeTotals,
        dailyCaffeineLimit: weeklyData?.dailyCaffeineLimit,
        dailyCaffeineAvg: weeklyData?.dailyCaffeineAvg,
        overLimitDays: weeklyData?.overLimitDays,
        aiMessage: weeklyData?.aiMessage,
      }
    : periodType === 'monthly'
    ? {
        weeklyIntakeTotals: monthlyData?.weeklyIntakeTotals,
      }
    : {
        monthlyIntakeTotals: yearlyData?.monthlyIntakeTotals,
      };

  // 로딩 & 에러 관리
  const isLoading =
    periodType === 'weekly' ? loadingWeekly :
    periodType === 'monthly' ? loadingMonthly :
    loadingYearly;

  const isError =
    periodType === 'weekly' ? errorWeekly :
    periodType === 'monthly' ? errorMonthly :
    errorYearly;

  const errorMessage =
    periodType === 'weekly' ? weeklyError?.message :
    periodType === 'monthly' ? monthlyError?.message :
    yearlyError?.message;

    useEffect(() => {
      if (periodType === 'weekly') {
        refetchWeekly();
      } else if (periodType === 'monthly') {
        refetchMonthly();
      } else {
        refetchYearly();
      }
    }, [periodType, selectedYear, selectedMonth, selectedWeek]);

  useEffect(() => {
    const onResize = () => setIsLarge(window.innerWidth >= 450 && window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handlePeriodChange = (period: PeriodType) => {
    setPeriodType(period);
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
        <DropdownSelector
          selectedPeriod={periodType}
          onPeriodChange={handlePeriodChange}
        />

        <PeriodFilterSelector
          period={periodType}
          selectedYear={`${selectedYear}년`}
          selectedMonth={`${selectedMonth}월`}
          selectedWeek={selectedWeek}
          onYearChange={(y) => setSelectedYear(y.replace('년',''))}
          onMonthChange={(m) => setSelectedMonth(m.replace('월',''))}
          onWeekChange={(w) => setSelectedWeek(w)}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
               <LoadingSpinner type="clip" size="small" fullScreen={false} />
          </div>
        ) : isError ? (
          <EmptyState
          title="데이터 로딩 실패"
          description={errorMessage}
          icon={<AlertTriangle className="w-10 h-10 text-[#D1D1D1]" />}
        />
        ) : (
          <>
            <ReportChart period={periodType} data={reportData} />

            <h2 className="mt-6 mb-3 text-md font-semibold text-[#000000]">
              리포트 요약
            </h2>
            <ReportSummary
              period={periodType}
              averageCaffeine={reportData.dailyCaffeineAvg ?? 0}
              dailyLimit={reportData.dailyCaffeineLimit ?? 0}
              overLimitDays={reportData.overLimitDays ?? 0}
            />

            {periodType === 'weekly' && (
              <>
                <h2 className="mt-6 mb-3 text-md font-semibold text-[#000000]">
                  리포트 결과
                </h2>
                <ReportMessage
                  period={periodType}
                  statusMessage={reportData.aiMessage ?? ''}
                />
              </>
            )}
          </>
        )}

        {/* 플로팅 버튼 */}
        <button
           className={`fixed bottom-18 ${isLarge? 'right-[calc(50%_-_225px_+_20px)]' : 'right-5'} w-12 h-12 cursor-pointer rounded-full bg-[#545F71] text-white flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)] lg:left-224 xl:left-288 2xl:left-352`}
          onClick={() => navigate('/main/diary')}
        >
          <Calendar size={24} />
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
}

