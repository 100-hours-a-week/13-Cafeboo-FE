import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Label } from '@/components/ui/label';
import { Range } from 'react-range';
import { Tag } from '@/components/common/Tag';
import { AlertCircle, Info } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { sanitizeDecimalInput } from '@/utils/inputUtils';

const formSchema = z.object({
  averageDailyCaffeineIntake: z
    .number()
    .min(0, '카페인 섭취량은 최소 0잔 이상이어야 합니다.')
    .max(15, '카페인 섭취량은 최대 15잔 이하여야 합니다.'),
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
  const [averageDailyCaffeineIntake, setAverageDailyCaffeineIntakeInput] =
    useState(
      caffeineInfo.averageDailyCaffeineIntake != null
        ? String(caffeineInfo.averageDailyCaffeineIntake)
        : ''
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
      caffeineInfo.averageDailyCaffeineIntake != null
        ? String(caffeineInfo.averageDailyCaffeineIntake)
        : ''
    );
  }, [caffeineInfo.averageDailyCaffeineIntake]);

  return (
    <div className="space-y-6 py-4">
      {/* 카페인 민감도 */}
      <div className="mb-10">
        <div className="flex items-center mb-2">
          <Label className="text-base font-semibold">카페인 민감도</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1 rounded-full ml-1 cursor-pointer">
                <Info className="w-4 h-4 stroke-2 text-gray-500" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="end"
              className="w-64 px-4 py-2 bg-white rounded-lg shadow-lg border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">카페인 민감도란?</h3>
                <PopoverPrimitive.Close asChild>
                  <button className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">닫기</span>×
                  </button>
                </PopoverPrimitive.Close>
              </div>
              <div className="text-xs text-gray-600 space-y-2">
                <p>
                  <span className="font-medium">~30% 미만:</span>
                  <span className="ml-1">영향이 거의 없음</span>
                </p>
                <p>
                  <span className="font-medium">31 ~ 40%:</span>
                  <span className="ml-1">영향을 약간 받음</span>
                </p>
                <p>
                  <span className="font-medium">41~80%:</span>
                  <span className="ml-1">영향을 받음</span>
                </p>
                <p>
                  <span className="font-medium">81~100%:</span>
                  <span className="ml-1">영향을 많이 받음</span>
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="px-3 mt-10">
          <Range
            step={1}
            min={0}
            max={100}
            values={[caffeineInfo.caffeineSensitivity]}
            onChange={([v]) => updateCaffeine({ caffeineSensitivity: v })}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '6px',
                  width: '100%',
                  background: '#AAAAAA4D',
                  borderRadius: '9999px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    height: '6px',
                    borderRadius: '9999px',
                    backgroundColor: '#FE9400',
                    width: `${caffeineInfo.caffeineSensitivity}%`,
                    top: 0,
                    left: 0,
                  }}
                />
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '24px',
                  width: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: '2px solid #FE9400',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#FE9400',
                    color: 'white',
                    fontSize: '12px',
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                  }}
                >
                  {caffeineInfo.caffeineSensitivity}
                </div>
              </div>
            )}
          />
        </div>
        <div className="flex justify-between mt-2 pl-2 text-[#595959] text-sm select-none">
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      {/* 하루 평균 섭취량 */}
      <div className="flex items-center justify-between mt-10 mb-8">
        <Label className="text-base font-semibold">
          하루 평균 카페인 음료 섭취량
        </Label>
        <div className="flex items-center">
          <input
            type="text"
            inputMode="decimal"
            value={averageDailyCaffeineIntake}
            onChange={(e) => {
              const sanitized = sanitizeDecimalInput(e.target.value);
              setAverageDailyCaffeineIntakeInput(sanitized);
              setValue('averageDailyCaffeineIntake', Number(sanitized));
              trigger('averageDailyCaffeineIntake');
            }}
            onBlur={() => {
              const num = parseFloat(averageDailyCaffeineIntake);
              if (!isNaN(num))
                updateCaffeine({ averageDailyCaffeineIntake: num });
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
        <Label className="text-base mt-4 mb-4 block font-semibold">
          선호하는 종류(중복 선택 가능)
        </Label>
        <div className="w-full ">
          <Tag
            items={DRINK_OPTIONS.map((label) => ({ label }))}
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
