import { useState } from 'react';
import { useDailyCaffeineReport } from '@/api/home/dailyReportApi';
import { useRecordCaffeineIntake } from '@/api/caffeine/caffeineApi';
import { useDrinkList } from '@/api/home/drinkListApi';
import type { CaffeineIntakeRequestDTO } from '@/api/caffeine/caffeine.dto';
import type { DrinkList } from '@/api/home/drinkList.dto';
import { findDrinkInfo } from '@/utils/drinkUtils'; 
import { useAuthStore } from '@/stores/useAuthStore';
import HomePageUI from '@/pages/home/HomePageUI';
import cafeList from '@/data/cafe_drinks.json';
import { brandLogos } from '@/data/brandLogos';

export default function HomeContainer() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const isGuest = useAuthStore(state => state.isGuest());

  const {
    data: report,
    isLoading: isReportLoading,
    isError: isReportError,
    error: reportError,
    refetch,
  } = useDailyCaffeineReport();

  const { mutateAsyncFn: recordCaffeineIntake } = useRecordCaffeineIntake();

  const { data: recommendedDrinks = [], isLoading: isDrinksLoading, isError: isDrinksError, error: drinksError } = useDrinkList();

  const aiDrinks = recommendedDrinks.map((rec: DrinkList) => {
    const info = findDrinkInfo(cafeList, rec.drink_id);
    if (!info) return null;

    return {
      brand: info.cafeName,
      name: info.name,
      score: Math.floor(rec.score * 10000),
      temperature: info.temperature,
      logo: brandLogos[info.cafeName] ?? undefined,
    };
  })
  .filter(Boolean) as {
    brand: string;
    name: string;
    score: number;
    temperature: string;
    logo?: string;
  }[];

  const handleSubmitRecord = async (record: CaffeineIntakeRequestDTO) => {
    try {
      await recordCaffeineIntake(record);
      await refetch();
    } catch (error: any) {
      setAlertMessage(error.message || '카페인 등록에 실패했습니다.');
      setIsAlertOpen(true);
    }
  };

  return (
    <HomePageUI
      isGuest={isGuest}
      isSheetOpen={isSheetOpen}
      setIsSheetOpen={setIsSheetOpen}
      isAlertOpen={isAlertOpen}
      setIsAlertOpen={setIsAlertOpen}
      alertMessage={alertMessage}
      report={report}
      isReportLoading={isReportLoading}
      isReportError={isReportError}
      reportError={reportError}
      aiDrinks={aiDrinks}
      isDrinksLoading={isDrinksLoading}
      isDrinksError={isDrinksError}
      drinksError={drinksError}
      onSubmitRecord={handleSubmitRecord}
    />
  );
}
