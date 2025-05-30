import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { AlertCircle } from 'lucide-react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TwoOptionToggle from '@/components/common/TwoOptionToggle';
import { sanitizeIntegerInput, sanitizeDecimalInput } from '@/utils/number';

const formSchema = z.object({
  age: z
    .number()
    .min(1, "나이는 최소 1세 이상이어야 합니다.")
    .max(123, "나이는 최대 123세 이하이어야 합니다."),
  height: z
    .number()
    .min(63, "신장은 최소 63 cm 이상이어야 합니다.")
    .max(251, "신장은 최대 251 cm 이하이어야 합니다."),
  weight: z
    .number()
    .min(6.5, "체중은 최소 6.5 kg 이상이어야 합니다.")
    .max(635, "체중은 최대 635 kg 이하이어야 합니다."),
});

// ✅ React Hook Form에서 타입 정의
type FormData = z.infer<typeof formSchema>;

const Step1 = () => {
  const { healthInfo, updateHealth } = useOnboardingStore();
  const [heightInput, setHeightInput] = useState(
    healthInfo.height != null ? String(healthInfo.height) : ''
  );
  const [weightInput, setWeightInput] = useState(
    healthInfo.weight != null ? String(healthInfo.weight) : ''
  );

  const {
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    setValue("age", healthInfo.age ?? '');
    setHeightInput(healthInfo.height != null ? String(healthInfo.height) : '');
    setWeightInput(healthInfo.weight != null ? String(healthInfo.weight) : '');
  }, [healthInfo, setValue]);

  return (
    <div className="space-y-6 py-4">
      {/* 성별 */}
      <div className="mb-8">
        <TwoOptionToggle
          options={[
            { label: '남자', value: 'M' },
            { label: '여자', value: 'F' },
          ]}
          value={String(healthInfo.gender)}
          onChange={(v) => updateHealth({ gender: v })}
        />
      </div>

      {/* 나이 입력 (mobile numeric pad) */}
      <div className="flex items-center justify-between mb-8">
        <Label className="text-base font-semibold">나이</Label>
        <div className="flex items-center">
          <span className="text-base">만</span>
          <input
            type="text"
            inputMode="numeric"
            value={healthInfo.age ?? ''}
            onChange={(e) => {
              const sanitized = sanitizeIntegerInput(e.target.value);
              updateHealth({ age: sanitized === '' ? undefined : Number(sanitized) });
              setValue("age", Number(sanitized));
              trigger("age");
            }}
            className="
              w-16             
              ml-2 mr-1   
              py-1       
              text-center
              border border-[#C7C7CC]
              rounded-lg
              text-base
              focus:outline-none focus:border-[#FE9400]
            "
          />
          <span className="text-base mr-2">세</span>
        </div>
      </div>
      {errors.age && (
          <p className="text-[13px] text-red-500 mt-[-10px] flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.age.message}
          </p>
      )}

      {/* 신장 입력 */}
      <div className="flex items-center justify-between mb-8">
        <Label className="text-base font-semibold">신장</Label>
        <div className="flex items-center">
          <input
            type="text"
            inputMode="decimal"
            value={heightInput}
            onChange={(e) => {
              const sanitized = sanitizeDecimalInput(e.target.value);
              setHeightInput(sanitized);
              setValue("height", Number(sanitized));
              trigger("height");
            }}
            onBlur={() => {
              const num = parseFloat(heightInput);
              if (!isNaN(num)) updateHealth({ height: num });
              else updateHealth({ height: undefined });
            }}
            className="
              w-16             
              ml-2 mr-1   
              py-1       
              text-center
              border border-[#C7C7CC]
              rounded-lg
              text-base
              focus:outline-none focus:border-[#FE9400]
            "
          />
          <span className="text-base">cm</span>
        </div>
      </div>
      {errors.height && (
          <p className="text-[13px] text-red-500 mt-[-10px] flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.height.message}
          </p>
      )}

      {/* 체중 입력 */}
      <div className="flex items-center justify-between mb-8">
        <Label className="text-base font-semibold">체중</Label>
        <div className="flex items-center">
          <input
            type="text"
            inputMode="decimal"
            value={weightInput}
            onChange={(e) => {
              const sanitized = sanitizeDecimalInput(e.target.value);
              setWeightInput(sanitized);
              setValue("weight", Number(sanitized));
              trigger("weight");
            }}
            onBlur={() => {
              const num = parseFloat(weightInput);
              if (!isNaN(num)) updateHealth({ weight: num });
              else updateHealth({ weight: undefined });
            }}
            className="
              w-16 mx-2 py-1 text-center
              border border-[#C7C7CC]
              rounded-lg text-base
              focus:outline-none focus:border-[#FE9400]
            "
          />
          <span className="text-base">kg</span>
        </div>
      </div>
      {errors.weight && (
          <p className="text-[13px] text-red-500 mt-[-10px] flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.weight.message}
          </p>
      )}

      {/* Boolean 토글 4개 */}
      <div className="grid grid-cols-2 gap-6">
        {[
          { key: 'isPregnant', label: '임신 여부' },
          { key: 'isTakingBirthPill', label: '피임약 복용' },
          { key: 'isSmoking', label: '흡연 여부' },
          { key: 'hasLiverDisease', label: '간 관련 질병' },
        ].map(({ key, label }) => {
          const val = (healthInfo as any)[key] as boolean;

          return (
            <div key={key}>
            <Label className="mb-2 block text-base font-semibold">
              {label}
            </Label>
    
            <TwoOptionToggle
              options={[
                { label: '예', value: 'true' },
                { label: '아니오', value: 'false' },
              ]}
              value={String(val)}
              onChange={(v) => updateHealth({ [key]: v === 'true' })}
            />
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default Step1;
