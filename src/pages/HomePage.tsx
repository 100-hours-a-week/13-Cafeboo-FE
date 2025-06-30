import { useState } from 'react';
import { Plus } from 'lucide-react';
import PageLayout from '@/layout/PageLayout';
import HeroBanner from '@/components/home/HeroBanner';
import DailyCaffeineIntakeGraph from '@/components/home/DailyCaffeine';
import DailyCaffeineRemain from '@/components/home/DailyCaffeineRemain';
import BannerImage1 from '@/assets/Banner04.png';
import BannerImage2 from '@/assets/Banner02.png';
import BannerImage3 from '@/assets/Banner03.png';
import CaffeineBottomSheet from '@/components/caffeine/CaffeineBottomSheet';
import type { CaffeineIntakeRequestDTO } from "@/api/caffeine/caffeine.dto";
import { useRecordCaffeineIntake } from '@/api/caffeine/caffeineApi';
import { useDailyCaffeineReport } from '@/api/home/dailyReportApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AlertModal from '@/components/common/AlertModal';
import { Info, AlertTriangle } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import SectionCard from '@/components/common/SectionCard';
import TodayCoffeeChatSection from '@/components/home/TodayCoffeeChatSection';

export default function HomePage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const slides = [
    { imageUrl: BannerImage1, text: '' },
    { imageUrl: BannerImage2, text: '' },
    { imageUrl: BannerImage3, text: '' },
  ];

  const { data: report, isLoading: isReportLoading, isError: isReportError, error: reportError, refetch } = useDailyCaffeineReport();
  const { mutateAsyncFn: recordCaffeineIntake, isError: isRecordError, error: recordError } = useRecordCaffeineIntake();

  const handleSubmitRecord = async (record: CaffeineIntakeRequestDTO) => {
    try {
      await recordCaffeineIntake(record);
      await refetch();
    } catch (error:any) {
      console.error("카페인 섭취 등록 오류:"+`${error.status}(${error.code}) - ${error.message}`);
      setAlertMessage(error.message || "카페인 등록에 실패했습니다.");
      setIsAlertOpen(true);       
    }
  };

  return (
    <PageLayout headerMode="logo">
        {/* Hero Banner */}
        <SectionCard className="!p-0 overflow-hidden">
          <HeroBanner slides={slides} />
        </SectionCard>

        <h2 className="mt-4 mb-2 text-base text-[#333333] font-semibold">
          오늘의 카페인 섭취량
        </h2>

        {/* 일일 섭취량 카드 */}
        <SectionCard className="!p-2">
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
                nickname={report?.nickname ?? ""}
                dailyCaffeineLimit={report?.dailyCaffeineLimit ?? 0}
                dailyCaffeineIntakeMg={report?.dailyCaffeineIntakeMg ?? 0}
                dailyCaffeineIntakeRate={report?.dailyCaffeineIntakeRate ?? 0}
                intakeGuide={report?.intakeGuide ?? ""}
              />
            )}
        </SectionCard>

        <h2 className="mt-4 mb-2 text-base text-[#333333] font-semibold">
          카페인 잔존량
        </h2>

        {/* 시간대별 잔여량 카드 */}
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

        <TodayCoffeeChatSection />

        {/* 카페인 추가 버튼 */}
        <button
          className="
          absolute bottom-6
          left-1/2 transform -translate-x-1/2
          w-40 h-12
          rounded-full
          font-semibold
          text-base
          bg-[#FE9400]
          text-white flex items-center justify-center
          shadow-[0_6px_10px_rgba(0,0,0,0.2)]
          z-20
          mx-auto
          cursor-pointer
        "
          onClick={() => setIsSheetOpen(true)}
        >
          <Plus size={24} className="mr-2" />
          ADD DRINK
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
