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
import AiDrinkRecommendation from '@/components/home/AiDrinkRecommendation';
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
    logo?: string;
    temperature?: string;
    name: string;
    score: number;
  }[];
  isDrinksLoading: boolean;
  isDrinksError: boolean;
  drinksError?: any;
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
  aiDrinks,
  isDrinksLoading,
  isDrinksError,
  drinksError,
  onSubmitRecord,
}: HomePageUIProps) {
  const slides = [
    { imageUrl: BannerImage1, text: '' },
    { imageUrl: BannerImage2, text: '' },
    { imageUrl: BannerImage3, text: '' },
  ];

  // 카페부 2기 서비스 버튼 목록
  const serviceList = [
    { name: '유틸', url: 'https://youtil.co.kr/', tags: [] },
    { name: '튜닝', url: 'https://hertz-tuning.com/', tags: ['취업'] },
    { name: '커리어비', url: 'https://www.careerbee.co.kr/', tags: ['취업'] },
    { name: '모아', url: 'https://moagenda.com/home', tags: [] },
    { name: '온기', url: 'https://ongi.today/', tags: ['소셜'] },
    { name: '네모', url: 'https://nemo.ai.kr/', tags: ['소셜'] },
    { name: '돌핀', url: 'https://dolpin.site/', tags: ['소셜'] },
    { name: '품앗이', url: 'https://tebutebu.com/', tags: ['소셜'] },
    { name: '미야옹', url: 'https://www.meowng.com/', tags: ['소셜'] },
    { name: '윙터뷰', url: 'https://wingterview.com/', tags: ['취업'] },
    { name: '루퍼', url: 'https://looper.my/', tags: ['관리'] },
    { name: '마롱', url: 'https://marong.co.kr/', tags: [] },
    { name: '카페부', url: 'https://www.cafeboo.com/', tags: ['소셜', '관리'] },
    { name: '뭉치면산다', url: 'https://moongsan.com/', tags: ['쇼핑'] },
    { name: '애숲하', url: 'https://leafresh.app/', tags: ['소셜'] },
    { name: '온더탑', url: 'https://onthe-top.com/', tags: ['쇼핑'] },
    { name: '뉴썸', url: 'https://new-sum.com/', tags: ['뉴스'] },
    { name: '탐나라', url: 'https://tam-nara.com/main', tags: ['뉴스'] },
    { name: '스펙랭킹', url: 'https://specranking.net/', tags: ['취업'] },
    { name: '춘이네비서실', url: 'https://www.kakaotech.com/', tags: ['뉴스'] },
    { name: '코코', url: 'https://ktbkoco.com/', tags: ['취업'] },
    { name: '카카오베이스', url: 'https://www.kakaobase.com/', tags: ['소셜'] },
  ];
  const [selectedService, setSelectedService] = useState('');

  const tagList = ['전체', '소셜', '취업', '뉴스', '관리', '쇼핑'];
  const [selectedTag, setSelectedTag] = useState('전체');

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
        <AiDrinkRecommendation aiDrinks={aiDrinks} isGuest={isGuest}/>
      )}


    {/* 카페부 2기 서비스 섹션 */}
    <h2 className="mt-6 mb-2 text-base text-[#333333] font-semibold">카테부 2기 서비스</h2>
      {/* 태그 리스트 */}
      <div className="flex gap-2 mb-2 overflow-x-auto">
        {tagList.map((tag) => (
          <button
            key={tag}
            className={`px-3 py-1 rounded-full border text-xs font-medium whitespace-nowrap transition-colors
              ${selectedTag === tag
                ? 'bg-[#FE9400] border-[#FE9400] text-white font-bold'
                : 'bg-white border-[#E5E5E5] text-[#333]'}
            `}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <SectionCard className="!p-4">
        <div className="grid grid-cols-4 gap-2">
          {(selectedTag === '전체' ? serviceList : serviceList.filter(service => service.tags.includes(selectedTag))).map((service) => (
            <button
              key={service.name}
              className={`py-2 rounded-lg border text-xs font-medium transition-colors
                hover:bg-[#FFF3E0] hover:border-[#FE9400] hover:text-[#FE9400] cursor-pointer
                ${selectedService === service.name
                  ? 'bg-[#FFE6B3] border-[#FE9400] text-[#FE9400] font-bold'
                  : 'bg-white border-[#E5E5E5] text-[#333]'}
              `}
              onClick={() => {
                setSelectedService(service.name);
                window.open(service.url, '_blank');
              }}
            >
              {service.name}
            </button>
          ))}
        </div>
      </SectionCard>

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
