import PageLayout from '@/layout/PageLayout';
import DropdownSelector from '@/components/report/DropdownSelector';
import PeriodFilterSelector from '@/components/report/PeriodFilterSelector';
import ReportChart from '@/components/report/ReportChart';
import ReportSummary from '@/components/report/ReportSummary';
import ReportMessage from '@/components/report/ReportMessage';
import CaffeineBottomSheetContainer from '@/components/caffeine/containers/CaffeineBottomSheetContainer';
import AlertModal from '@/components/common/AlertModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { AlertTriangle, Info } from 'lucide-react';

interface Status {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

interface Handlers {
  onPeriodChange: (period: 'weekly' | 'monthly' | 'yearly') => void;
  onSubmitRecord: (record: any) => void;
}

interface Controls {
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
  isAlertOpen: boolean;
  setIsAlertOpen: (open: boolean) => void;
  alertMessage: string;
}

interface ReportPageUIProps {
  periodType: 'weekly' | 'monthly' | 'yearly';
  selectedYear: string;
  selectedMonth: string;
  selectedWeek: string;
  setSelectedYear: (year: string) => void;
  setSelectedMonth: (month: string) => void;
  setSelectedWeek: (week: string) => void;
  reportData: any;
  status: Status;
  handlers: Handlers;
  controls: Controls;
}

export default function ReportPageUI({
  periodType,
  selectedYear,
  selectedMonth,
  selectedWeek,
  setSelectedYear,
  setSelectedMonth,
  setSelectedWeek,
  reportData,
  status,
  handlers,
  controls,
}: ReportPageUIProps) {
  const {
    isLoading,
    isError,
    errorMessage,
  } = status;
  const {
    onPeriodChange,
    onSubmitRecord,
  } = handlers;
  const {
    isSheetOpen,
    setIsSheetOpen,
    isAlertOpen,
    setIsAlertOpen,
    alertMessage,
  } = controls;

  return (
    <PageLayout
      headerMode="logo"
      showAdd={true}
      onAddClick={() => setIsSheetOpen(true)}
    >
      <DropdownSelector
        selectedPeriod={periodType}
        onPeriodChange={onPeriodChange}
      />

      <PeriodFilterSelector
        period={periodType}
        selectedYear={`${selectedYear}년`}
        selectedMonth={`${selectedMonth}월`}
        selectedWeek={`${selectedWeek}주차`}
        weeksofMonth={reportData.weeklyIntakeTotals?.length ?? 0}
        onYearChange={(y) => setSelectedYear(y.replace('년', ''))}
        onMonthChange={(m) => setSelectedMonth(m.replace('월', ''))}
        onWeekChange={(w) => setSelectedWeek(w.replace('주차', ''))}
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
            <ReportMessage statusMessage={reportData.aiMessage ?? ''} />
          )}
        </>
      )}

      <CaffeineBottomSheetContainer
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmitRecord={onSubmitRecord}
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
