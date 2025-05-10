import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Label } from '@/components/ui/label';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { Tag } from '@/components/common/Tag';
import { AlertCircle } from 'lucide-react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  averageDailyCaffeineIntake: z
    .number()
    .min(0, "카페인 섭취량은 최소 0잔 이상이어야 합니다.")
    .max(15, "카페인 섭취량은 최대 15잔 이하여야 합니다."),
});

// ✅ React Hook Form에서 타입 정의
type FormData = z.infer<typeof formSchema>;

const DRINK_OPTIONS = [
  '아메리카노',
  '카페라떼',
  '콜드브루',
  '에스프레소',
  '카푸치노',
  '디카페인',
  '바닐라라떼',
  '에너지음료',
  '모카',
  '아이스커피',
  '마끼아또',
  '기타',
];

const Step2 = () => {
  const { caffeineInfo, updateCaffeine } = useOnboardingStore();
  const [averageDailyCaffeineIntake, setAverageDailyCaffeineIntakeInput] = useState(
    caffeineInfo.averageDailyCaffeineIntake != null ? String(caffeineInfo.averageDailyCaffeineIntake) : ''
  );

    const {
      trigger,
      setValue,
      formState: { errors },
    } = useForm<FormData>({
      resolver: zodResolver(formSchema),
    });


  useEffect(() => {
    setAverageDailyCaffeineIntakeInput(
      caffeineInfo.averageDailyCaffeineIntake != null ? String(caffeineInfo.averageDailyCaffeineIntake) : ''
    );
  }, [caffeineInfo.averageDailyCaffeineIntake]);

  return (
    <div className="space-y-6 py-4">
      {/* 카페인 민감도 */}
      <div className="mb-10">
        <Label className="text-base text-[#000000] mb-2 block font-semibold">
          카페인 민감도
        </Label>
        <SliderPrimitive.Root
          className="relative flex items-center mt-10 mb-10 ml-4 mr-8"
          value={[caffeineInfo.caffeineSensitivity]}
          min={0}
          max={100}
          step={1}
          onValueChange={([v]) => updateCaffeine({ caffeineSensitivity: v })}
        >
          <SliderPrimitive.Track className="relative flex-1 h-1 bg-[#AAAAAA]/30 rounded-full">
            <SliderPrimitive.Range className="absolute h-full bg-[#FE9400]" />
          </SliderPrimitive.Track>

          <SliderPrimitive.Thumb className="relative block h-6 w-6 rounded-full bg-white border-2 border-[#FE9400]">
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-[#FE9400] text-white text-xs px-2 py-1 rounded-full">
              {caffeineInfo.caffeineSensitivity}
            </div>
          </SliderPrimitive.Thumb>

          <span className="absolute left-[-15px] text-sm text-[#595959]">
            0
          </span>
          <span className="absolute right-[-30px] text-sm text-[#595959]">
            100
          </span>
        </SliderPrimitive.Root>
      </div>

      {/* 하루 평균 섭취량 */}
      <div className="flex items-center justify-between mt-10 mb-8">
        <Label className="text-base text-[#000000] font-semibold">
          하루 평균 카페인 음료 섭취량
        </Label>
        <div className="flex items-center">
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.]?[0-9]*"
            value={averageDailyCaffeineIntake}
            onChange={(e) => {
              let v = e.target.value.replace(/[^0-9.]/g, '');
              const parts = v.split('.');
              if (parts.length > 1) {
                parts[1] = parts[1].slice(0, 1);
                v = parts[0] + '.' + parts[1];
              }
              setAverageDailyCaffeineIntakeInput(v);
              setValue("averageDailyCaffeineIntake", Number(v));
              trigger("averageDailyCaffeineIntake"); 
            }}
            onBlur={() => {
              const num = parseFloat(averageDailyCaffeineIntake);
              if (!isNaN(num)) updateCaffeine({ averageDailyCaffeineIntake: num });
              else updateCaffeine({ averageDailyCaffeineIntake: undefined });
            }}
            className="
            w-16 mx-1 py-1 text-center 
            border border-[#C7C7CC]
            rounded-lg text-base
            focus:outline-none focus:border-[#FE9400]
          "
          />
          <span className="text-base">잔</span>
        </div>
      </div>
      {errors.averageDailyCaffeineIntake && (
          <p className="text-[13px] text-red-500 mt-[-10px] flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.averageDailyCaffeineIntake.message}
          </p>
      )}

      {/* 선호하는 카페인 음료 */}
      <div className="mt-10">
        <Label className="text-base text-[#000000] mt-4 mb-4 block font-semibold">
          선호하는 종류(중복 선택 가능)
        </Label>
        <div className="w-full ">
          <Tag
            items={DRINK_OPTIONS}
            value={caffeineInfo.userFavoriteDrinks || []}
            onChange={(values) =>
              updateCaffeine({ userFavoriteDrinks: values })
            }
            multiple
          />
        </div>
      </div>
    </div>
  );
};

export default Step2;
