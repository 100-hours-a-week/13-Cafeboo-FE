import { useEffect } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import StepProgress from '@/components/onboarding/StepProgress';
import Step1 from '@/components/onboarding/Step1';
import Step2 from '@/components/onboarding/Step2';
import Step3 from '@/components/onboarding/Step3';
import Step4 from '@/components/onboarding/Step4';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const { step, next, back, reset, healthInfo, caffeineInfo, sleepInfo } = useOnboardingStore();
  
    const handleComplete = async () => {
      // 1) API 호출로 healthInfo, caffeineInfo, sleepInfo 전송
  
      // 2) 전역 스토어 초기화
      reset();
  
      // 3) 홈으로 이동
      navigate('/auth/login');
    };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      default:
        return null;
    }
  };

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="h-screen w-full bg-white dark:bg-[#121212]">
      <div className="flex-1 overflow-auto px-4 pt-6 mt-10 max-w-md mx-auto">
        <StepProgress currentStep={step} totalSteps={4} />
        {renderStep()}
      </div>

      <div className="fixed bottom-0 inset-x-0">
        <div className="max-w-md w-full mx-auto px-4 py-6 bg-white dark:bg-[#121212]">
          <div className="flex justify-between px-4">
            {step > 1 ? (
              <Button
                variant="outline"
                className="border-[#FF9B17] text-[#333333]"
                onClick={back}
              >
                이전
              </Button>
            ) : (
              <div className="w-[6rem]" />
            )}
            <Button
              className="bg-[#FF9B17] text-white"
              onClick={step === 4 ? handleComplete : next}
            >
              {step === 4 ? '완료' : '다음'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;