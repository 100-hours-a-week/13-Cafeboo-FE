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
  const { step, next, back, reset } = useOnboardingStore();

  const handleComplete = async () => {
    // TODO: API 호출
    reset();
    navigate('/auth/login');
  };

  useEffect(() => {
    reset();
  }, [reset]);

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 />;
      case 2: return <Step2 />;
      case 3: return <Step3 />;
      case 4: return <Step4 />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-white">
      {/* 모바일 프레임: 390px 고정, relative 로 자식 절대 위치 기준 */}
      <div className="relative w-[390px] h-screen flex flex-col">
        {/* 스크롤 가능한 본문 */}
        <div className="flex-1 overflow-auto px-4 pt-6 mt-10">
          <StepProgress currentStep={step} totalSteps={4} />
          {renderStep()}
        </div>

        {/* 스티키 Footer */}
        <div className="sticky bottom-0 inset-x-0 bg-white px-4 py-6">
          <div className="flex justify-between">
            {step > 1
              ? (
                <Button
                  variant="outline"
                  className="border-[#FE9400] text-[#333333]"
                  onClick={back}
                >
                  이전
                </Button>
              )
              : <div className="w-24" />}
            <Button
              className="bg-[#FE9400] text-white"
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
