import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Header from '@/components/common/Header';
import HeroBanner from '@/components/home/HeroBanner';
import DailyCaffeineIntakeGraph from '@/components/home/DailyCaffeine';
import DailyCaffeineRemain from '@/components/home/DailyCaffeineRemain';
import BannerImage1 from '@/assets/banner1.png'
import CaffeineBottomSheet from "@/components/caffeine/CaffeineBootmSheet";
import type { CaffeineRecordInput } from "@/components/caffeine/CaffeineDetailForm"

export default function HomePage() {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // 임의 데이터
  const slides = [
    { imageUrl: BannerImage1, text: '' },
    { imageUrl: BannerImage1, text: '' },
    { imageUrl: BannerImage1, text: '' },
  ];

  const report = {
    nickname: 'User',
    dailyCaffeineLimit: 400,
    dailyCaffeineIntakeMg: 135,
    sleepSensitiveThreshold: 100,
    intakeGuide: '지금 커피를 추가로 마시면 수면에 영향을 줄 수 있어요.',
    caffeineByHour: Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      caffeineMg: Math.floor(Math.random() * 500),
    })),
  };

  const handleSubmitRecord = (record: CaffeineRecordInput) => {
    console.log("최종 카페인 기록:", record)
    setIsSheetOpen(false)
  }

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <Header mode="logo" />

      {/* 본문 */}
      <main className="pt-16 space-y-4">
        {/* Hero Banner */}
        <div className="relative w-full overflow-hidden rounded-lg shadow-sm border border-gray-200">
          <HeroBanner slides={slides} />
        </div>

        <h2 className="mt-6 mb-3 text-base text-[#333333] font-semibold">
              오늘의 카페인 섭취량
        </h2>

        {/* 일일 섭취량 카드 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <DailyCaffeineIntakeGraph
            nickname={report.nickname}
            dailyCaffeineLimit={report.dailyCaffeineLimit}
            dailyCaffeineIntakeMg={report.dailyCaffeineIntakeMg}
            intakeGuide={report.intakeGuide}
          />
        </div>

        <h2 className="mt-6 mb-3 text-base text-[#333333] font-semibold">
              카페인 잔존량
        </h2>

        {/* 시간대별 잔여량 카드 */}
        <div className="bg-white pl-2 pr-2 pt-2 rounded-lg shadow-sm border border-gray-200">
          <DailyCaffeineRemain
            caffeineByHour={report.caffeineByHour} 
            sleepSensitiveThreshold={report.sleepSensitiveThreshold}
          />
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
          md:left-184
          lg:left-216      
          xl:left-248   
          2xl:left-312
          cursor-pointer
        "
          onClick={() => setIsSheetOpen(true)}
        >
          <Plus size={24} className='mr-2' />ADD DRINK
        </button>
      </main>
      <CaffeineBottomSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmitRecord={handleSubmitRecord}
      />
    </div>
  );
}
