import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useOnboardingStore } from '@/stores/onboardingStore';

const Step1 = () => {
  const { healthInfo, updateHealth } = useOnboardingStore();
  const gender = healthInfo.gender || 'male';
  const [weightInput, setWeightInput] = useState(
    healthInfo.weight != null ? String(healthInfo.weight) : ''
  )

  useEffect(() => {
    setWeightInput(healthInfo.weight != null ? String(healthInfo.weight) : '')
  }, [healthInfo.weight])

  return (
    <div className="space-y-6 py-4">
      {/* 성별 */}
      <div className="mb-8">
        <Label className="text-base text-[#000000] mb-2 block font-semibold">
          성별
        </Label>
        <ToggleGroup
          type="single"
          value={gender}
          onValueChange={(v) => updateHealth({ gender: v as "male" | "female" })}
          className="flex w-full"
        >
          <ToggleGroupItem
            value="male"
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
            value="female"
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
      {healthInfo.age != null && (healthInfo.age < 1 || healthInfo.age > 123) && (
            <p className="mt-1 text-sm text-red-500">
              * 나이는 최소 1, 최대 123까지 유효합니다.
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

      {/* Boolean 토글 4개 */}
      <div className="grid grid-cols-2 gap-6">
        {[
          { key: 'pregnancy',      label: '임신 여부'      },
          { key: 'birthControl',   label: '피임약 복용'    },
          { key: 'smoking',        label: '흡연 여부'      },
          { key: 'liverDisease',   label: '간 관련 질병'   },
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
                onValueChange={(v) => updateHealth({ [key]: v === 'yes' })}
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


