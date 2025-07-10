import PageLayout from '@/layout/PageLayout';
import HeroBanner from '@/components/home/HeroBanner';
import DailyCaffeineIntakeGraph from '@/components/home/DailyCaffeine';
import DailyCaffeineRemain from '@/components/home/DailyCaffeineRemain';
import BannerImage1 from '@/assets/Banner04.png';
import BannerImage2 from '@/assets/Banner02.png';
import BannerImage3 from '@/assets/Banner03.png';
import CaffeineBottomSheetContainer from '@/components/caffeine/containers/CaffeineBottomSheetContainer';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AlertModal from '@/components/common/AlertModal';
import EmptyState from '@/components/common/EmptyState';
import SectionCard from '@/components/common/SectionCard';
import TodayCoffeeChatContainer from '@/components/home/containers/TodayCoffeeChatContainer';
import { Plus, Info, AlertTriangle } from 'lucide-react';

interface HomePageUIProps {
  isGuest: boolean;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
  isAlertOpen: boolean;
  setIsAlertOpen: (open: boolean) => void;
  alertMessage: string;
  report: any;
  isReportLoading: boolean;
  isReportError: boolean;
  reportError: any;
  onSubmitRecord: (record: any) => Promise<void>;
}

export default function HomePageUI({
  isGuest,
  isSheetOpen,
  setIsSheetOpen,
  isAlertOpen,
  setIsAlertOpen,
  alertMessage,
  report,
  isReportLoading,
  isReportError,
  reportError,
  onSubmitRecord,
}: HomePageUIProps) {
  const slides = [
    { imageUrl: BannerImage1, text: '' },
    { imageUrl: BannerImage2, text: '' },
    { imageUrl: BannerImage3, text: '' },
  ];

  return (
    <PageLayout headerMode="logo" showGuestModeBanner={isGuest}>
      <SectionCard className="!p-0 overflow-hidden">
        <HeroBanner slides={slides} />
      </SectionCard>

      <h2 className="mt-4 mb-2 text-base text-[#333333] font-semibold">
        오늘의 카페인 섭취량
      </h2>

      <SectionCard className="!px-2 !py-1">
        {isReportLoading ? (
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner type="clip" size="small" fullScreen={false} />
          </div>
        ) : isReportError ? (
          <EmptyState
            title="데이터 로딩 실패"
            description={reportError.message}
            icon={<AlertTriangle className="w-10 h-10 text-[#D1D1D1]" />}
          />
        ) : (
          <DailyCaffeineIntakeGraph
            nickname={isGuest ? '익명의 사용자' : (report?.nickname ?? '')}
            dailyCaffeineLimit={report?.dailyCaffeineLimit ?? 0}
            dailyCaffeineIntakeMg={report?.dailyCaffeineIntakeMg ?? 0}
            dailyCaffeineIntakeRate={report?.dailyCaffeineIntakeRate ?? 0}
            intakeGuide={report?.intakeGuide ?? ''}
          />
        )}
      </SectionCard>

      <h2 className="mt-4 mb-2 text-base text-[#333333] font-semibold">
        카페인 잔존량
      </h2>

      <SectionCard className="!pl-1 pb-0 pt-1">
        {isReportLoading ? (
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner type="clip" size="small" fullScreen={false} />
          </div>
        ) : isReportError ? (
          <EmptyState
            title="데이터 로딩 실패"
            description={reportError.message}
            icon={<AlertTriangle className="w-10 h-10 text-[#D1D1D1]" />}
          />
        ) : (
          <DailyCaffeineRemain
            caffeineByHour={report?.caffeineByHour ?? []}
            sleepSensitiveThreshold={report?.sleepSensitiveThreshold ?? 0}
          />
        )}
      </SectionCard>

      <TodayCoffeeChatContainer />

      <button
        className="absolute bottom-22 left-1/2 transform -translate-x-1/2 w-40 h-12 rounded-full font-semibold text-base bg-[#FE9400] text-white flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)] z-20 mx-auto cursor-pointer"
        onClick={() => setIsSheetOpen(true)}
      >
        <Plus size={24} className="mr-2" />
        ADD DRINK
      </button>

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
