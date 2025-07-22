import PageLayout from '@/layout/PageLayout';
import HeroBanner from '@/components/home/HeroBanner';
import DailyCaffeineIntakeGraph from '@/components/home/DailyCaffeine';
import DailyCaffeineRemain from '@/components/home/DailyCaffeineRemain';
import BannerImage1 from '@/assets/Banner01.png?w=351;702;1053&format=webp;avif&as=picture';
import BannerImage2 from '@/assets/Banner03.png?w=351;702;1053&format=webp;avif&as=picture';
import BannerImage3 from '@/assets/Banner02.png?w=351;702;1053&format=webp;avif&as=picture';
import CaffeineBottomSheetContainer from '@/components/caffeine/containers/CaffeineBottomSheetContainer';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AlertModal from '@/components/common/AlertModal';
import EmptyState from '@/components/common/EmptyState';
import SectionCard from '@/components/common/SectionCard';
import TodayCoffeeChatContainer from '@/components/home/containers/TodayCoffeeChatContainer';
import AiDrinkRecommendation from '@/components/home/AiDrinkRecommendation';
import type { PictureImage } from '@/types/image';
import { Plus, Info, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

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
  aiDrinks: {
    brand: string;
    logo?: PictureImage; 
    temperature?: string;
    name: string;
    score: number;
  }[];
  isDrinksLoading: boolean;
  isDrinksError: boolean;
  drinksError?: any;
  onSubmitRecord: (record: any) => Promise<void>;
  handleKaKaoLogin: () => void;
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
  aiDrinks,
  isDrinksLoading,
  isDrinksError,
  drinksError,
  onSubmitRecord,
  handleKaKaoLogin,
}: HomePageUIProps) {
  const slides = [
    { imageUrl: BannerImage1, link: '/event' },
    { imageUrl: BannerImage2, link: '/coffeechat' },
    { imageUrl: BannerImage3, link: '/report' },
  ];

  return (
    <PageLayout headerMode="logo">
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

      {/* AI 음료 추천 섹션 */}
      <h2 className="mt-6 mb-2 text-base text-[#333333] font-semibold">AI 음료 추천</h2>
      {isDrinksLoading ? (
        <div className="flex justify-center items-center h-20">
          <LoadingSpinner type="clip" size="small" fullScreen={false} />
        </div>
      ) : isDrinksError ? (
        <EmptyState
          title="추천 음료 데이터를 불러오지 못했습니다."
          description={drinksError?.message || '데이터 로딩 중 오류가 발생했습니다.'}
          icon={<AlertTriangle className="w-10 h-10 text-[#D1D1D1]" />}
        />
      ) : (
        <AiDrinkRecommendation aiDrinks={aiDrinks} isGuest={isGuest} directKakaoLogin={handleKaKaoLogin}/>
      )}

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
