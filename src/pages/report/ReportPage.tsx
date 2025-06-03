import { useState, useEffect } from 'react';
import PageLayout from '@/layout/PageLayout';
import { Calendar, Plus, AlertTriangle, Info } from 'lucide-react';
import DropdownSelector, { PeriodType } from '@/components/report/DropdownSelector';
import PeriodFilterSelector from '@/components/report/PeriodFilterSelector';
import ReportChart from '@/components/report/ReportChart';
import ReportSummary from '@/components/report/ReportSummary';
import ReportMessage from '@/components/report/ReportMessage';
import { useNavigate } from 'react-router-dom';
import CaffeineBottomSheet from '@/components/caffeine/CaffeineBottomSheet';
import type { CaffeineIntakeRequestDTO } from "@/api/caffeine/caffeine.dto";
import { useWeeklyReport } from '@/api/report/weeklyReportApi';
import { useMonthlyReport } from '@/api/report/monthlyReportApi';
import { useYearlyReport } from '@/api/report/yearlyReportApi';
import { recordCaffeineIntake } from '@/api/caffeine/caffeineApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import AlertModal from '@/components/common/AlertModal';
import { getWeekOfMonth } from 'date-fns';

interface ReportApiData {
  // 주간
  dailyIntakeTotals?: { date: string; caffeineMg: number }[];
  dailyCaffeineLimit?: number;
  caffeineAvg?: number;
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
  const defaultWeek = `${getWeekOfMonth(today)}`;

  const [periodType, setPeriodType] = useState<PeriodType>('weekly');
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedWeek, setSelectedWeek] = useState(defaultWeek);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
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
        caffeineAvg: weeklyData?.dailyCaffeineAvg,
        overLimitDays: weeklyData?.overLimitDays,
        aiMessage: weeklyData?.aiMessage,
      }
    : periodType === 'monthly'
    ? {
        caffeineAvg: monthlyData?.weeklyCaffeineAvg,
        weeklyIntakeTotals: monthlyData?.weeklyIntakeTotals,
      }
    : {
        caffeineAvg: yearlyData?.monthlyCaffeineAvg,
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

  const handlePeriodChange = (period: PeriodType) => {
    setPeriodType(period);
  };

  const handleSubmitRecord = async (record: CaffeineIntakeRequestDTO) => {
    try {
      await recordCaffeineIntake(record);
      refetchWeekly();
      refetchMonthly();
      refetchYearly();
    } catch (err: any) {
      console.error("카페인 섭취 등록 오류:", err.response?.data?.message || err.message);
      setIsAlertOpen(true);       
    }
  };

  return (
    <PageLayout headerMode="logo">
        <DropdownSelector
          selectedPeriod={periodType}
          onPeriodChange={handlePeriodChange}
        />

        <PeriodFilterSelector
          period={periodType}
          selectedYear={`${selectedYear}년`}
          selectedMonth={`${selectedMonth}월`}
          selectedWeek={`${selectedWeek}주차`}
          weeksofMonth={monthlyData?.weeklyIntakeTotals.length}
          onYearChange={(y) => setSelectedYear(y.replace('년',''))}
          onMonthChange={(m) => setSelectedMonth(m.replace('월',''))}
          onWeekChange={(w) => setSelectedWeek(w.replace('주차',''))}
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

            <h2 className="mt-6 mb-2 text-md font-semibold text-[#000000]">
              리포트 요약
            </h2>
            <ReportSummary
              period={periodType}
              averageCaffeine={reportData.caffeineAvg ?? 0}
              dailyLimit={reportData.dailyCaffeineLimit ?? 0}
              overLimitDays={reportData.overLimitDays ?? 0}
            />

            {periodType === 'weekly' && (
              <>
                <ReportMessage
                  statusMessage={reportData.aiMessage ?? ''}
                />
              </>
            )}
          </>
        )}

        {/* 플로팅 버튼 */}
        <button
          className={"absolute bottom-18 right-5 w-12 h-12 cursor-pointer rounded-full bg-gray-500 text-white flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)]"}
          onClick={() => navigate('/main/diary')}
        >
          <Calendar size={24} />
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
}

