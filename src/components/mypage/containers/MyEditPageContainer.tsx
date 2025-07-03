import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthInfo, useUpdateHealthInfo } from '@/api/health/healthInfoApi';
import { useCaffeineInfo, useUpdateCaffeineInfo } from '@/api/caffeine/caffeineInfoApi';
import MyEditPageUI from '@/components/mypage/MyEditPageUI';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function MyEditPageContainer() {
  const navigate = useNavigate();
  const { data: healthInfo, refetch: refetchHealthInfo } = useHealthInfo();
  const { data: caffeineInfo, refetch: refetchCaffeineInfo } = useCaffeineInfo();

  const { mutateAsyncFn: updateHealthAsync, isLoading: isSavingHealth } = useUpdateHealthInfo();
  const { mutateAsyncFn: updateCaffeineAsync, isLoading: isSavingCaffeine } = useUpdateCaffeineInfo();

  const [error, setError] = useState<string | null>(null);
  const isLoading = isSavingHealth || isSavingCaffeine;

  const handleSave = async (data: any) => {
    setError(null);
    try {
      await updateHealthAsync({
        gender: data.gender,
        age: data.age,
        height: data.height,
        weight: data.weight,
        isPregnant: data.isPregnant,
        isTakingBirthPill: data.isTakingBirthPill,
        isSmoking: data.isSmoking,
        hasLiverDisease: data.hasLiverDisease,
        sleepTime: data.sleepTime,
        wakeUpTime: data.wakeUpTime,
      });

      await updateCaffeineAsync({
        caffeineSensitivity: data.caffeineSensitivity,
        averageDailyCaffeineIntake: data.averageDailyCaffeineIntake,
        userFavoriteDrinks: data.userFavoriteDrinks,
        frequentDrinkTime: data.frequentDrinkTime,
      });

      await refetchHealthInfo();
      await refetchCaffeineInfo();

      navigate('/main/mypage');
    } catch (e: any) {
      console.error('수정 중 오류:', e);
      setError(e.message || '수정 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <LoadingSpinner type="clip" size="large" fullScreen={false} />
      </div>
    );
  }

  return (
    <MyEditPageUI
      isLoading={isLoading}
      error={error}
      setError={setError}
      onSave={handleSave}
      onBackClick={() => navigate('/main/mypage')}
      initHealth={healthInfo}
      initCaffeine={caffeineInfo}
    />
  );
}
