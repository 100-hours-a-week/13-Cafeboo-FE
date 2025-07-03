import { useState } from 'react';
import { useDailyCaffeineReport } from '@/api/home/dailyReportApi';
import { useRecordCaffeineIntake } from '@/api/caffeine/caffeineApi';
import type { CaffeineIntakeRequestDTO } from '@/api/caffeine/caffeine.dto';
import HomePageUI from '@/pages/home/HomePageUI';

export default function HomePageContainer() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const {
    data: report,
    isLoading: isReportLoading,
    isError: isReportError,
    error: reportError,
    refetch,
  } = useDailyCaffeineReport();

  const { mutateAsyncFn: recordCaffeineIntake } = useRecordCaffeineIntake();

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
      isSheetOpen={isSheetOpen}
      setIsSheetOpen={setIsSheetOpen}
      isAlertOpen={isAlertOpen}
      setIsAlertOpen={setIsAlertOpen}
      alertMessage={alertMessage}
      report={report}
      isReportLoading={isReportLoading}
      isReportError={isReportError}
      reportError={reportError}
      onSubmitRecord={handleSubmitRecord}
    />
  );
}
