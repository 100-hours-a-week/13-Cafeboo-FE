import { useState } from 'react';
import { Plus } from 'lucide-react';
import Header from '@/components/common/Header';
import HeroBanner from '@/components/home/HeroBanner';
import DailyCaffeineIntakeGraph from '@/components/home/DailyCaffeine';
import DailyCaffeineRemain from '@/components/home/DailyCaffeineRemain';
import BannerImage1 from '@/assets/Banner01.png';
import BannerImage2 from '@/assets/Banner02.png';
import BannerImage3 from '@/assets/Banner03.png';
import CaffeineBottomSheet from '@/components/caffeine/CaffeineBootmSheet';
import type { CaffeineRecordInput } from '@/components/caffeine/CaffeineDetailForm';
import { recordCaffeineIntake } from '@/api/caffeineApi';
import { useDailyCaffeineReport } from '@/api/dailyReportApi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AlertModal from '@/components/common/AlertModal';
import { Info, AlertTriangle } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';

export default function HomePage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 임의 데이터
  const slides = [
    { imageUrl: BannerImage1, text: '' },
    { imageUrl: BannerImage2, text: '' },
    { imageUrl: BannerImage3, text: '' },
  ];

  const { data: report, isLoading, isError, error } = useDailyCaffeineReport();

  const handleSubmitRecord = async (record: CaffeineRecordInput) => {
    try {
      const response = await recordCaffeineIntake({
        drinkId: record.drinkId.toString(),
        drinkSize: record.drinkSize,
        intakeTime: record.intakeTime,
        drinkCount: record.drinkCount,
        CaffeineAmount: Number(record.CaffeineAmount.toFixed(1)), 
      });
      console.log("카페인 섭취 등록 성공:", response);
    } catch (err: any) {
      console.error("카페인 섭취 등록 오류:", err.response?.data?.message || err.message);
      setAlertMessage(err.response?.data?.message || "카페인 등록에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <Header mode="logo" />

      {/* 본문 */}
      <main className="pt-16 space-y-4">
        {/* Hero Banner */}
        <div className="w-full overflow-hidden rounded-lg shadow-sm border border-gray-200">
          <HeroBanner slides={slides} />
        </div>

        <h2 className="mt-6 mb-3 text-base text-[#333333] font-semibold">
          오늘의 카페인 섭취량
        </h2>

        {/* 일일 섭취량 카드 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner type="clip" size="small" fullScreen={false} />
              </div>
            ) : isError ? (
              <EmptyState
                title="데이터 로딩 실패"
                description={(error as Error).message}
                icon={<AlertTriangle className="w-10 h-10 text-[#D1D1D1]" />}
              />
            ) : (
              <DailyCaffeineIntakeGraph
                nickname={report?.nickname}
                dailyCaffeineLimit={report?.dailyCaffeineLimit}
                dailyCaffeineIntakeMg={report?.dailyCaffeineIntakeMg}
                intakeGuide={report?.intakeGuide}
              />
            )}
        </div>

        <h2 className="mt-6 mb-3 text-base text-[#333333] font-semibold">
          카페인 잔존량
        </h2>

        {/* 시간대별 잔여량 카드 */}
        <div className="bg-white pl-2 pr-2 pt-2 rounded-lg shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner type="clip" size="small" fullScreen={false} />
            </div>
          ) : isError ? (
            <EmptyState
              title="데이터 로딩 실패"
              description={(error as Error).message}
              icon={<AlertTriangle className="w-10 h-10 text-[#D1D1D1]" />}
            />
          ) : (
            <DailyCaffeineRemain
              caffeineByHour={report?.caffeineByHour ?? []}
              sleepSensitiveThreshold={report?.sleepSensitiveThreshold ?? 0}
            />
          )}
        </div>

        {/* 카페인 추가 버튼 */}
        <button
          className="
          fixed bottom-6
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
          lg:left-184      
          xl:left-248   
          2xl:left-312
          cursor-pointer
        "
          onClick={() => setIsSheetOpen(true)}
        >
          <Plus size={24} className="mr-2" />
          ADD DRINK
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
