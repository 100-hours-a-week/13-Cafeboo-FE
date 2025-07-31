import { useEffect, useState } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import StepProgress from '@/components/onboarding/StepProgress';
import Step1 from '@/components/onboarding/Step1';
import Step2 from '@/components/onboarding/Step2';
import Step3 from '@/components/onboarding/Step3';
import Step4 from '@/components/onboarding/Step4';
import { useNavigate } from 'react-router-dom';
import AlertModal from '@/components/common/AlertModal';
import { Info } from 'lucide-react';
import { useSubmitCaffeineInfo } from '@/api/caffeine/caffeineInfoApi';
import { useSubmitHealthInfo } from '@/api/health/healthInfoApi';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { step, next, back, reset, healthInfo, caffeineInfo, sleepInfo } =
    useOnboardingStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const submitHealthInfo = useSubmitHealthInfo();
  const submitCaffeineInfo = useSubmitCaffeineInfo();

  const handleModalConfirm = () => {
    setShowModal2(false);
    navigate('/');
  };

  // API 호출
  const handleComplete = async () => {
    try {
      // HealthInfo API 요청
      await submitHealthInfo.mutateAsyncFn({
        gender: healthInfo.gender,
        age: healthInfo.age,
        height: healthInfo.height,
        weight: healthInfo.weight,
        isPregnant: healthInfo.isPregnant ?? false,
        isTakingBirthPill: healthInfo.isTakingBirthPill ?? false,
        isSmoking: healthInfo.isSmoking ?? false,
        hasLiverDisease: healthInfo.hasLiverDisease ?? false,
        sleepTime: sleepInfo.sleepTime,
        wakeUpTime: sleepInfo.wakeUpTime,
      });

      // CaffeineInfo API 요청
      await submitCaffeineInfo.mutateAsyncFn({
        caffeineSensitivity: caffeineInfo.caffeineSensitivity,
        averageDailyCaffeineIntake: caffeineInfo.averageDailyCaffeineIntake,
        frequentDrinkTime: sleepInfo.frequentDrinkTime || '00:00',
        userFavoriteDrinks: caffeineInfo.userFavoriteDrinks || [],
      });

      // 성공 시 메인 페이지로 이동
      reset();
      navigate('/');
    } catch (error) {
      setErrorMessage('온보딩 정보 저장 중 오류가 발생했습니다.');
      setShowModal(true);
      console.log(error);
    }
  };

  useEffect(() => {
    reset();
  }, [reset]);

  const validateStep = () => {
    setErrorMessage(null);
    switch (step) {
      case 1:
        if (!healthInfo.age || healthInfo.age < 1 || healthInfo.age > 123) {
          setErrorMessage('올바른 나이를 입력해주세요.');
          return false;
        }
        if (
          !healthInfo.height ||
          healthInfo.height < 62 ||
          healthInfo.height > 251
        ) {
          setErrorMessage('올바른 신장을 입력해주세요.');
          return false;
        }
        if (
          !healthInfo.weight ||
          healthInfo.weight < 6.5 ||
          healthInfo.weight > 635
        ) {
          setErrorMessage('올바른 체중을 입력해주세요.');
          return false;
        }
        return true;
      case 2:
        if (
          caffeineInfo.averageDailyCaffeineIntake === undefined ||
          caffeineInfo.averageDailyCaffeineIntake < 0 ||
          caffeineInfo.averageDailyCaffeineIntake > 15
        ) {
          setErrorMessage('올바른 카페인 섭취량을 입력해주세요.');
          return false;
        }
        return true;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      next();
    } else {
      setShowModal(true);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form name="step1Form">
            <Step1 />
          </form>
        );
      case 2:
        return (
          <form name="step2Form">
            <Step2 />
          </form>
        );
      case 3:
        return (
          <form name="step3Form">
            <Step3 />
          </form>
        );
      case 4:
        return (
          <form name="step4Form">
            <Step4 />
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-white">
      <div className="w-full h-screen flex flex-col">
        {/* 스크롤 가능한 본문 */}
        <div className="flex-1 overflow-auto px-4 pt-6 mt-10">
          <StepProgress currentStep={step} totalSteps={4} />
          {renderStep()}
        </div>

        {/* 스티키 Footer */}
        <div className="sticky bottom-0 inset-x-0 bg-white px-4 py-6">
          <div className="flex justify-between gap-4">
            {step > 1 ? (
              <button
                className="h-12 border border-[#FE9400] text-[#333333] max-w-[160px] w-full py-2 rounded-md text-lg"
                onClick={back}
              >
                이전
              </button>
            ) : (
              <div className="w-flex-1" />
            )}
            <button
              className="h-12 bg-[#FE9400] text-white max-w-[160px] w-full py-2 rounded-md text-lg"
              onClick={step === 4 ? handleComplete : handleNext}
            >
              {step === 4 ? '완료' : '다음'}
            </button>
          </div>
        </div>
      </div>
      <AlertModal
        isOpen={showModal}
        icon={<Info size={36} className="text-[#FE9400]" />}
        title="사용자 정보 입력 오류"
        message={errorMessage ?? '입력한 정보가 유효하지 않습니다.'}
        onClose={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
        confirmText="확인"
        showCancelButton={false}
      />
      <AlertModal
        isOpen={showModal2}
        icon={<Info size={36} className="text-[#FE9400]" />}
        title="오류 발생"
        message={errorMessage ?? '오류가 발생했습니다. 다시 시도해주세요.'}
        onClose={handleModalConfirm}
        onConfirm={handleModalConfirm}
        confirmText="확인"
        showCancelButton={false}
      />
    </div>
  );
};

export default OnboardingPage;
