import { useState } from 'react';
import PageLayout from '@/layout/PageLayout';
import HealthInfoEditor from '@/components/mypage/HealthInfoEditor';
import { useNavigate } from 'react-router-dom';
import { useUpdateHealthInfo } from '@/api//health/healthInfoApi';
import { useUpdateCaffeineInfo } from '@/api/caffeine/caffeineInfoApi';
import AlertModal from '@/components/common/AlertModal';
import { Info } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function MyPageEditPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    mutateAsyncFn: updateHealthInfoAsync,
    isLoading: isSavingHealth,
  } = useUpdateHealthInfo();

  const {
    mutateAsyncFn: updateCaffeineInfoAsync,
    isLoading: isSavingCaffeine,
  } = useUpdateCaffeineInfo();

  const handleSave = async (data: any) => {
    setError(null);
    try {
      await updateHealthInfoAsync({
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

      await updateCaffeineInfoAsync({
        caffeineSensitivity: data.caffeineSensitivity,
        averageDailyCaffeineIntake: data.averageDailyCaffeineIntake,
        userFavoriteDrinks: data.userFavoriteDrinks,
        frequentDrinkTime: data.frequentDrinkTime,
      });

      navigate('/main/mypage');
    } catch (e: any) {
      console.error('수정 중 오류:', e);
      setError(e.message || '수정 중 오류가 발생했습니다.');
    }
  };

  if (isSavingHealth || isSavingCaffeine) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <LoadingSpinner type="clip" size="large" fullScreen={false} />
      </div>
    );
  }

  return (
    <PageLayout headerMode="title" headerTitle="내 정보 수정" onBackClick={() => navigate('/main/mypage')}>
      <HealthInfoEditor onSave={handleSave} />
      <AlertModal
        isOpen={!!error}
        icon={<Info size={36} className="text-[#FE9400]" />}
        title="수정 오류"
        message={error!}
        onClose={() => setError(null)}
        onConfirm={() => setError(null)}
        confirmText="확인"
        showCancelButton={false}
      />
    </PageLayout>
  );
}
