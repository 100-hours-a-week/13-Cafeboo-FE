import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { AlertCircle } from 'lucide-react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  age: z
    .number()
    .min(1, "나이는 최소 1세 이상이어야 합니다.")
    .max(123, "나이는 최대 123세 이하이어야 합니다."),
  height: z
    .number()
    .min(62, "신장은 최소 63 cm 이상이어야 합니다.")
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
    setValue("height", healthInfo.height ?? '');
    setWeightInput(healthInfo.weight != null ? String(healthInfo.weight) : '');
  }, [healthInfo, setValue]);

  return (
    <div className="space-y-6 py-4">
      {/* 성별 */}
      <div className="mb-8">
        <Label className="text-base text-[#000000] mb-2 block font-semibold">
          성별
        </Label>
        <ToggleGroup
          type="single"
          value={healthInfo.gender??'M'}
          onValueChange={(v) =>{
            if (v) updateHealth({ gender: v as 'M' | 'F' });
          }}
          className="flex w-full"
        >
          <ToggleGroupItem
            value="M"
            className="
              flex-1 py-2 text-sm font-medium text-center cursor-pointer
              rounded-l-lg border border-[#D9D9D9]
              data-[state=on]:bg-white
              data-[state=on]:border-[#FE9400]
              data-[state=on]:text-[#333333]
              data-[state=off]:bg-[#F1F3F3]
              data-[state=off]:text-[#595959]
              data-[state=off]:border-r-0
            "
          >
            남자
          </ToggleGroupItem>

          <ToggleGroupItem
            value="F"
            className="
              flex-1 py-2 text-sm font-medium text-center cursor-pointer
              rounded-r-lg border border-[#D9D9D9]
              data-[state=on]:bg-white
              data-[state=on]:border-[#FE9400]
              data-[state=on]:text-[#333333]
              data-[state=off]:bg-[#F1F3F3]
              data-[state=off]:text-[#595959]
              data-[state=off]:border-l-0
            "
          >
            여자
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* 나이 입력 (mobile numeric pad) */}
      <div className="flex items-center justify-between mb-8">
        <Label className="text-base text-[#000000] font-semibold">나이</Label>
        <div className="flex items-center">
          <span className="text-base">만</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={healthInfo.age ?? ''}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '');
              updateHealth({ age: v === '' ? undefined : Number(v) });
              setValue("age", Number(v));
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
        <Label className="text-base text-[#000000] font-semibold">신장</Label>
        <div className="flex items-center">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={healthInfo.height ?? ''}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '');
              updateHealth({ height: v === '' ? undefined : Number(v) });
              setValue("height", Number(v));
              trigger("height"); 
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
        <Label className="text-base text-[#000000] font-semibold">체중</Label>
        <div className="flex items-center">
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.]?[0-9]*"
            value={weightInput}
            onChange={(e) => {
              let v = e.target.value.replace(/[^0-9.]/g, '');
              const parts = v.split('.');
              if (parts.length > 1) {
                parts[1] = parts[1].slice(0, 1);
                v = parts[0] + '.' + parts[1];
              }
              setWeightInput(v);
              setValue("weight", Number(v));
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
              <Label className="text-[#000000] mb-2 block text-base font-semibold">
                {label}
              </Label>

              <ToggleGroup
                type="single"
                value={val ? 'yes' : 'no'}
                onValueChange={(v) => {
                  if (v) {
                    updateHealth({ [key]: v === 'yes' });
                  }
                }}
                className="flex w-full"
              >
                <ToggleGroupItem
                  value="yes"
                  className="
                    flex-1 py-2 text-sm font-medium text-center cursor-pointer
                    rounded-l-lg border border-[#D9D9D9]
                    data-[state=on]:bg-white
                    data-[state=on]:border-[#FE9400]
                    data-[state=on]:text-[#333333]
                    data-[state=off]:bg-[#F1F3F3]
                    data-[state=off]:text-[#595959]
                    data-[state=off]:border-r-0
                  "
                >
                  예
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="no"
                  className="
                    flex-1 py-2 text-sm font-medium text-center cursor-pointer
                    rounded-r-lg border border-[#D9D9D9]
                    data-[state=on]:bg-white
                    data-[state=on]:border-[#FE9400]
                    data-[state=on]:text-[#333333]
                    data-[state=off]:bg-[#F1F3F3]
                    data-[state=off]:text-[#595959]
                    data-[state=off]:border-l-0
                  "
                >
                  아니오
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Step1;
