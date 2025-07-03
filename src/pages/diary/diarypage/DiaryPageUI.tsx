import PageLayout from '@/layout/PageLayout';
import { Info, AlertTriangle } from 'lucide-react';
import CaffeineCalendar from '@/components/diary/CaffeineCalendar';
import CaffeineList from '@/components/diary/CaffeineList';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import AlertModal from '@/components/common/AlertModal';
import SectionCard from '@/components/common/SectionCard';
import CaffeineBottomSheetContainer from '@/components/caffeine/containers/CaffeineBottomSheetContainer';

interface Status {
  isLoading: boolean;
  isError: boolean;
  error: any;
}

interface Handlers {
  onDateSelect: (date: string) => Promise<void>;
  onMonthChange: (year: number, month: number) => void;
  onEdit: (intakeId: string) => void;
  onSubmitRecord: (record: any) => void;
  onMainClick: () => void;
}

interface DiaryPageUIProps {
  year: number;
  month: number;
  selectedDate: string;
  caffeineData: Record<string, number>;
  dataDaily: any;
  calendarStatus: Status;
  dailyStatus: Status;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
  isAlertOpen: boolean;
  setIsAlertOpen: (open: boolean) => void;
  alertMessage: string;
  handlers: Handlers;
}

export default function DiaryPageUI({
  year,
  month,
  selectedDate,
  caffeineData,
  dataDaily,
  calendarStatus,
  dailyStatus,
  isSheetOpen,
  setIsSheetOpen,
  isAlertOpen,
  setIsAlertOpen,
  alertMessage,
  handlers,
}: DiaryPageUIProps) {
  const { onMainClick, onDateSelect, onMonthChange, onEdit, onSubmitRecord } = handlers;

  return (
    <PageLayout
      headerMode="logo"
      fabType="report"        
      showAdd={true}        
      onMainClick={onMainClick} 
      onAddClick={() => setIsSheetOpen(true)}  
    >
      <SectionCard>
        {calendarStatus.isLoading ? (
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner type="clip" size="small" fullScreen={false} />
          </div>
        ) : calendarStatus.isError ? (
          <EmptyState
            title="캘린더 로딩 실패"
            description={calendarStatus.error?.message}
            icon={<AlertTriangle className="w-10 h-10" />}
          />
        ) : (
          <CaffeineCalendar
            year={year}
            month={month}
            selectedDate={selectedDate}
            caffeineData={caffeineData}
            onDateSelect={onDateSelect}
            onMonthChange={onMonthChange}
          />
        )}
      </SectionCard>

      <h2 className="mt-6 mb-2 text-base text-[#000000] font-semibold">
        {new Date(selectedDate).getMonth() + 1}월 {new Date(selectedDate).getDate()}일 카페인 기록
      </h2>

      {dailyStatus.isLoading ? (
        <div className="item-center justify-center p-8">
          <LoadingSpinner type="clip" size="small" fullScreen={false} />
        </div>
      ) : dailyStatus.isError ? (
        <EmptyState
          title="데이터 로딩 실패"
          description={dailyStatus.error?.message}
          icon={<AlertTriangle className="w-10 h-10" />}
        />
      ) : (
        <CaffeineList records={dataDaily?.intakeList ?? []} onEdit={onEdit} />
      )}

      <CaffeineBottomSheetContainer
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmitRecord={onSubmitRecord}
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
}
