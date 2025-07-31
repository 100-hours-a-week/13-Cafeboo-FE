import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import TwoOptionToggle from '@/components/common/TwoOptionToggle';
import { Input } from '@/components/ui/input';
import { Tag } from '../common/Tag';
import { Range } from 'react-range';
import { AlertCircle, Info } from 'lucide-react';
import AlertModal from '@/components/common/AlertModal';
import { sanitizeIntegerInput, sanitizeDecimalInput } from '@/utils/inputUtils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

const formSchema = z.object({
  age: z
    .number({ required_error: '나이를 입력해주세요.' })
    .min(1, '나이는 최소 1세 이상이어야 합니다.')
    .max(123, '나이는 최대 123세 이하이어야 합니다.'),
  height: z
    .number({ required_error: '신장을 입력해주세요.' })
    .min(63, '신장은 최소 63 cm 이상이어야 합니다.')
    .max(251, '신장은 최대 251 cm 이하이어야 합니다.'),
  weight: z
    .number({ required_error: '체중을 입력해주세요.' })
    .min(6.5, '체중은 최소 6.5 kg 이상이어야 합니다.')
    .max(635, '체중은 최대 635 kg 이하이어야 합니다.'),
  averageDailyCaffeineIntake: z
    .number({ required_error: '카페인 섭취량을 입력해주세요.' })
    .min(0, '카페인 섭취량은 최소 0잔 이상이어야 합니다.')
    .max(15, '카페인 섭취량은 최대 15잔 이하여야 합니다.'),
});

type FormData = z.infer<typeof formSchema>;

export interface HealthInfoEditorProps {
  initHealth?: {
    gender: string;
    age: number;
    height: number;
    weight: number;
    isPregnant: boolean;
    isTakingBirthPill: boolean;
    isSmoking: boolean;
    hasLiverDisease: boolean;
    sleepTime: string;
    wakeUpTime: string;
  };
  initCaffeine?: {
    caffeineSensitivity: number;
    averageDailyCaffeineIntake: number;
    userFavoriteDrinks: string[];
    frequentDrinkTime: string;
  };
  onSave: (data: {
    gender: string;
    age: number;
    height: number;
    weight: number;
    isPregnant: boolean;
    isTakingBirthPill: boolean;
    isSmoking: boolean;
    hasLiverDisease: boolean;
    caffeineSensitivity: number;
    averageDailyCaffeineIntake: number;
    userFavoriteDrinks: string[];
    frequentDrinkTime: string;
    sleepTime: string;
    wakeUpTime: string;
  }) => Promise<void>;
}

export default function HealthInfoEditor({
  initHealth,
  initCaffeine,
  onSave,
}: HealthInfoEditorProps) {
  const [showAlertModal, setShowAlertModal] = useState(false);

  const [ageInput, setAgeInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [caffeineInput, setCaffeineInput] = useState('');

  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [isPregnant, setPregnancy] = useState(false);
  const [isTakingBirthPill, setBirthControl] = useState(false);
  const [isSmoking, setSmoking] = useState(false);
  const [hasLiverDisease, setHasLiverDisease] = useState(false);
  const [sleepTime, setSleepTime] = useState('22:00');
  const [wakeUpTime, setWakeTime] = useState('07:00');
  const [caffeineSensitivity, setCaffeineSensitivity] = useState(50);
  const [userFavoriteDrinks, setUserFavoriteDrinks] = useState<string[]>([]);
  const [frequentDrinkTime, setUsualIntakeTimes] = useState('12:00');

  const {
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      age: initHealth?.age ?? undefined,
      height: initHealth?.height ?? undefined,
      weight: initHealth?.weight ?? undefined,
      averageDailyCaffeineIntake:
        initCaffeine?.averageDailyCaffeineIntake ?? undefined,
    },
  });

  useEffect(() => {
    if (initHealth) {
      setAgeInput(initHealth.age.toString());
      setHeightInput(initHealth.height.toString());
      setWeightInput(initHealth.weight.toString());
      setGender(initHealth.gender === 'F' ? 'F' : 'M');
      setPregnancy(initHealth.isPregnant);
      setBirthControl(initHealth.isTakingBirthPill);
      setSmoking(initHealth.isSmoking);
      setHasLiverDisease(initHealth.hasLiverDisease);
      setSleepTime(initHealth.sleepTime);
      setWakeTime(initHealth.wakeUpTime);
      setValue('age', initHealth.age);
      setValue('height', initHealth.height);
      setValue('weight', initHealth.weight);
    }
  }, [initHealth, setValue]);

  useEffect(() => {
    if (initCaffeine) {
      setCaffeineSensitivity(initCaffeine.caffeineSensitivity ?? 50);
      setUserFavoriteDrinks(initCaffeine.userFavoriteDrinks ?? []);
      setUsualIntakeTimes(initCaffeine.frequentDrinkTime ?? '12:00');
      setCaffeineInput(initCaffeine.averageDailyCaffeineIntake.toString());
      setValue(
        'averageDailyCaffeineIntake',
        initCaffeine.averageDailyCaffeineIntake
      );
    }
  }, [initCaffeine, setValue]);

  const handleSave = async () => {
    const valid = await trigger([
      'age',
      'height',
      'weight',
      'averageDailyCaffeineIntake',
    ]);
    if (!valid) return setShowAlertModal(true);

    onSave({
      gender,
      age: Number(ageInput),
      height: Number(heightInput),
      weight: Number(weightInput),
      isPregnant,
      isTakingBirthPill,
      isSmoking,
      hasLiverDisease,
      caffeineSensitivity,
      averageDailyCaffeineIntake: Number(caffeineInput),
      userFavoriteDrinks,
      frequentDrinkTime,
      sleepTime,
      wakeUpTime,
    });
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeIntegerInput(e.target.value);
    setAgeInput(sanitized);
    const num = Number(sanitized);
    if (!isNaN(num)) {
      setValue('age', num);
      trigger('age');
    }
  };

  const handleDecimalChange =
    (setter: (v: string) => void, field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizeDecimalInput(e.target.value);
      setter(sanitized);
      const num = Number(sanitized);
      if (!isNaN(num)) {
        setValue(field, num);
        trigger(field);
      }
    };

  return (
    <div className="space-y-6">
      {/* 성별 */}
      <div>
        <Label className="font-semibold mb-2 block text-base">성별</Label>
        <TwoOptionToggle
          options={[
            { label: '남자', value: 'M' },
            { label: '여자', value: 'F' },
          ]}
          value={gender}
          onChange={(v) => setGender(v)}
        />
      </div>

      <div className="flex items-center justify-between mt-8">
        <Label className="text-base font-semibold">나이</Label>
        <div className="flex items-center">
          <span className="text-base">만</span>
          <input
            type="text"
            inputMode="numeric"
            value={ageInput}
            onChange={handleAgeChange}
            className="w-16 ml-2 mr-1 py-1 text-center border border-[#C7C7CC] rounded-lg text-base focus:outline-none focus:border-[#FE9400]"
          />
          <span className="text-base mr-2">세</span>
        </div>
      </div>
      {errors.age && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors.age.message}
        </p>
      )}

      {/* 신장 */}
      <div className="flex items-center justify-between mt-8">
        <Label className="text-base font-semibold">신장</Label>
        <div className="flex items-center">
          <input
            type="text"
            inputMode="decimal"
            value={heightInput}
            onChange={handleDecimalChange(setHeightInput, 'height')}
            className="w-16 ml-2 mr-1 py-1 text-center border border-[#C7C7CC] rounded-lg text-base focus:outline-none focus:border-[#FE9400]"
          />
          <span className="text-base">cm</span>
        </div>
      </div>
      {errors.height && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors.height.message}
        </p>
      )}

      {/* 체중 */}
      <div className="flex items-center justify-between mt-8">
        <Label className="text-base font-semibold">체중</Label>
        <div className="flex items-center">
          <input
            type="text"
            inputMode="decimal"
            value={weightInput}
            onChange={handleDecimalChange(setWeightInput, 'weight')}
            className="w-16 mx-2 py-1 text-center border border-[#C7C7CC] rounded-lg text-base focus:outline-none focus:border-[#FE9400]"
          />
          <span className="text-base">kg</span>
        </div>
      </div>
      {errors.weight && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors.weight.message}
        </p>
      )}

      {/* Boolean 토글 4개 */}
      <div className="grid grid-cols-2 gap-6">
        {[
          { val: isPregnant, setter: setPregnancy, label: '임신 여부' },
          {
            val: isTakingBirthPill,
            setter: setBirthControl,
            label: '피임약 복용',
          },
          { val: isSmoking, setter: setSmoking, label: '흡연 여부' },
          {
            val: hasLiverDisease,
            setter: setHasLiverDisease,
            label: '간 질환 여부',
          },
        ].map(({ val, setter, label }) => (
          <div key={label}>
            <Label className="mb-2 block text-base font-semibold">
              {label}
            </Label>
            <TwoOptionToggle
              options={[
                { label: '예', value: 'true' },
                { label: '아니오', value: 'false' },
              ]}
              value={String(val)}
              onChange={(v) => setter(v === 'true')}
            />
          </div>
        ))}
      </div>

      {/* 카페인 민감도 슬라이더 */}
      <div className="mb-10">
        <Label className="text-base mb-2 block font-semibold">
          카페인 민감도
        </Label>
        <div className="px-3 mt-10">
          <Range
            step={1}
            min={0}
            max={100}
            values={[caffeineSensitivity]}
            onChange={([v]) => setCaffeineSensitivity(v)}
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
                    width: `${caffeineSensitivity}%`,
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
                  {caffeineSensitivity}
                </div>
              </div>
            )}
          />
        </div>

        {/* 좌우 숫자 표시 */}
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
            value={caffeineInput}
            onChange={handleDecimalChange(
              setCaffeineInput,
              'averageDailyCaffeineIntake'
            )}
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
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors.averageDailyCaffeineIntake.message}
        </p>
      )}

      {/* 선호 음료 */}
      <div className="mt-10">
        <Label className="text-base mt-4 mb-4 block font-semibold">
          선호하는 종류(중복 선택 가능)
        </Label>
        <div className="w-full ">
          <Tag
            items={DRINK_OPTIONS.map((label) => ({ label }))}
            value={userFavoriteDrinks}
            onChange={setUserFavoriteDrinks}
            multiple
          />
        </div>
      </div>

      {/* 자주 마시는 시간대 */}
      <div>
        <Label className="text-base mb-2 block font-semibold">
          가장 자주 마시는 시간대
        </Label>
        <Input
          type="time"
          step={60}
          value={frequentDrinkTime ?? '12:00'}
          onChange={(e) => setUsualIntakeTimes(e.target.value)}
          className="
            w-full rounded-lg border border-[#C7C7CC] cursor-pointer
            px-4 py-2
            focus:outline-none focus:border-[#FE9400]
          "
        />
      </div>

      {/* 수면 시간 */}
      <div>
        <Label className="text-base mb-2 block font-semibold">수면 시간</Label>
        <div className="flex items-center space-x-2">
          <Input
            type="time"
            step={60}
            value={sleepTime}
            onChange={(e) => setSleepTime(e.target.value)}
            className="w-1/2 cursor-pointer border-[#C7C7CC] px-4 focus:outline-none focus:border-[#FE9400]"
          />
          <span>~</span>
          <Input
            type="time"
            step={60}
            value={wakeUpTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-1/2 cursor-pointer border-[#C7C7CC] px-4 focus:outline-none focus:border-[#FE9400]"
          />
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="py-4">
        <button
          onClick={handleSave}
          className="w-full py-3 h-12 rounded-lg bg-[#FE9400] text-[#FEFBF8] text-lg font-semibold mt-2 cursor-pointer"
        >
          저장하기
        </button>
      </div>

      <AlertModal
        isOpen={showAlertModal}
        icon={<Info size={36} className="text-[#FE9400]" />}
        onClose={() => setShowAlertModal(false)}
        title="입력 오류"
        message="올바른 값을 입력해주세요"
        showCancelButton={false}
      />
    </div>
  );
}
