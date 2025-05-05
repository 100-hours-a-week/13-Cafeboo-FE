import React from "react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgress = ({ currentStep, totalSteps }: StepProgressProps) => {
  return (
    <div className="flex items-center mb-8">
      {Array.from({ length: totalSteps }, (_, idx) => {
        const step = idx + 1;
        const isCurrent = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <React.Fragment key={step}>
            <div
              className={`
                flex items-center justify-center
                w-6 h-6 rounded-full font-medium text-sm
                ${isCurrent
                  ? 'bg-[#543122] text-white'
                  : 'border-2 text-[#543122] ' +
                    (isCompleted
                      ? 'border-[#543122]'
                      : 'border-[#C7B39C]')}
              `}
            >
              {step}
            </div>

            {step < totalSteps && (
              <div
                className={`
                  flex-1 mx-2
                  ${isCompleted
                    ? 'border-t-2 border-solid border-[#543122]'
                    : 'border-t-2 border-dashed border-[#C7B39C]'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepProgress;

  