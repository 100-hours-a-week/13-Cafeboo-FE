import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Header from '@/components/common/Header';
import HeroBanner from '@/components/home/HeroBanner';
import DailyCaffeineIntakeGraph from '@/components/home/DailyCaffeine';
import DailyCaffeineRemain from '@/components/home/DailyCaffeineRemain';

export default function HomePage() {
  const navigate = useNavigate();

  // 임의 데이터
  const slides = [
    { imageUrl: '/images/coffee1.jpg', text: '아침엔 아메리카노 한 잔!' },
    { imageUrl: '/images/coffee2.jpg', text: '달콤한 라떼로 오후를 시작하세요' },
    { imageUrl: '/images/coffee3.jpg', text: '콜드브루로 시원한 하루!' },
  ];

  const report = {
    nickname: 'User',
    dailyCaffeineLimit: 400,
    dailyCaffeineIntakeMg: 180,
    sleepSensitiveThreshold: 100,
    intakeGuide: '지금 커피를 추가로 마시면 수면에 영향을 줄 수 있어요.',
    caffeineByHour: Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      caffeineMg: Math.floor(Math.random() * 500),
    })),
  };

  return (
    <div className="dark:bg-[#121212] min-h-screen">
      {/* 헤더 */}
      <Header mode="logo" />

      {/* 본문 */}
      <main className="pt-16 space-y-4">
        {/* Hero Banner */}
        <div className="relative w-full rounded-xl overflow-hidden bg-black dark:bg-[#2C2C2C] shadow-[0_0_10px_rgba(0,0,0,0.1)]">
          <HeroBanner slides={slides} />
        </div>

        <h2 className="mt-6 mb-3 text-lg text-[#333333] font-semibold">
              오늘의 카페인 섭취량
        </h2>

        {/* 일일 섭취량 카드 */}
        <div className="bg-white dark:bg-[#2C2C2C] rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)]">
          <DailyCaffeineIntakeGraph
            nickname={report.nickname}
            dailyCaffeineLimit={report.dailyCaffeineLimit}
            dailyCaffeineIntakeMg={report.dailyCaffeineIntakeMg}
            intakeGuide={report.intakeGuide}
          />
        </div>

        <h2 className="mt-6 mb-3 text-lg text-[#333333] font-semibold">
              카페인 잔존량
        </h2>

        {/* 시간대별 잔여량 카드 */}
        <div className="bg-white dark:bg-[#2C2C2C] rounded-xl pl-2 pr-2 pt-2 shadow-[0_0_10px_rgba(0,0,0,0.1)]">
          <DailyCaffeineRemain
            caffeineByHour={report.caffeineByHour} 
            sleepSensitiveThreshold={report.sleepSensitiveThreshold}
          />
        </div>

        {/* 카페인 추가 버튼 */}
        <button
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#56433C] text-white flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)]"
          onClick={() => navigate('/home/add')}
        >
          <Plus size={24} />
        </button>
      </main>
    </div>
  );
}
