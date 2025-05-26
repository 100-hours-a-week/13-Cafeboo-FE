import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import TwoOptionToggle from '@/components/common/TwoOptionToggle';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { Input } from '@/components/ui/input';
import { Tag } from '../common/Tag';
import { AlertCircle, Info } from 'lucide-react';
import AlertModal from '@/components/common/AlertModal';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useHealthInfo } from '@/api/healthInfoApi';
import { useCaffeineInfo } from '@/api/caffeineInfoApi';

// 온보딩에서 쓰던 옵션 배열들
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
    .number({required_error: "나이를 입력해주세요."})
    .min(1, "나이는 최소 1세 이상이어야 합니다.")
    .max(123, "나이는 최대 123세 이하이어야 합니다."),
  height: z
    .number({required_error: "신장을 입력해주세요."})
    .min(63, "신장은 최소 63 cm 이상이어야 합니다.")
    .max(251, "신장은 최대 251 cm 이하이어야 합니다."),
  weight: z
    .number(({required_error: "체중을 입력해주세요."}))
    .min(6.5, "체중은 최소 6.5 kg 이상이어야 합니다.")
    .max(635, "체중은 최대 635 kg 이하이어야 합니다."),
  averageDailyCaffeineIntake: z
    .number(({required_error: "카페인 섭취량을 입력해주세요."}))
    .min(0, "카페인 섭취량은 최소 0잔 이상이어야 합니다.")
    .max(15, "카페인 섭취량은 최대 15잔 이하여야 합니다.")
});

type FormData = z.infer<typeof formSchema>;

export interface HealthInfoEditorProps {
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

export default function HealthInfoEditor({ onSave }: HealthInfoEditorProps) {
  const { data: initHealth }       = useHealthInfo();
  const { data: initCaffeine }     = useCaffeineInfo();
  const [showAlertModal, setShowAlertModal] = useState(false);

  const [ageInput, setAgeInput] = useState(initHealth?.age ?? undefined);
  const [heightInput, setHeightInput] = useState(initHealth?.height ?? undefined);
  const [weightInput, setWeightInput] = useState(initHealth?.weight ?? undefined);
  const [caffeineInput, setCaffeineInput] = useState(initCaffeine?.averageDailyCaffeineIntake ?? undefined);

  const [gender, setGender] = useState<'M' | 'F'>(initHealth?.gender ?? 'M');
  const [isPregnant, setPregnancy] = useState(initHealth?.isPregnant ?? false);
  const [isTakingBirthPill, setBirthControl] = useState(initHealth?.isTakingBirthPill ?? false);
  const [isSmoking, setSmoking] = useState(initHealth?.isSmoking ?? false);
  const [hasLiverDisease, setHasLiverDisease] = useState(initHealth?.hasLiverDisease ?? false);
  const [sleepTime, setSleepTime] = useState(initHealth?.sleepTime ?? '22:00');
  const [wakeUpTime, setWakeTime] = useState(initHealth?.wakeUpTime ?? '07:00');
  const [caffeineSensitivity, setCaffeineSensitivity] = useState(initCaffeine?.caffeineSensitivity ?? 50);
  const [userFavoriteDrinks, setUserFavoriteDrinks] = useState<string[]>(initCaffeine?.userFavoriteDrinks ?? []);
  const [frequentDrinkTime, setUsualIntakeTimes] = useState(initCaffeine?.frequentDrinkTime ?? '12:00');


  const {
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      age: initHealth?.age ?? undefined,
      height: initHealth?.height ?? undefined,
      weight: initHealth?.weight ?? undefined,
      averageDailyCaffeineIntake: initCaffeine?.averageDailyCaffeineIntake ?? undefined,
    },
  });

  useEffect(() => {
    if (initHealth) {
      setGender(initHealth.gender);
      setPregnancy(initHealth.isPregnant);
      setBirthControl(initHealth.isTakingBirthPill);
      setSmoking(initHealth.isSmoking);
      setHasLiverDisease(initHealth.hasLiverDisease);
      setSleepTime(initHealth.sleepTime);
      setWakeTime(initHealth.wakeUpTime);
      setAgeInput(initHealth.age);
      setHeightInput(initHealth.height);
      setWeightInput(initHealth.weight);
      setValue('age', initHealth.age);
      setValue('height', initHealth.height);
      setValue('weight', initHealth.weight);
    }
  }, [initHealth, setValue]);

  useEffect(() => {
    if (initCaffeine) {
      setCaffeineSensitivity(initCaffeine.caffeineSensitivity);
      setUserFavoriteDrinks(initCaffeine.userFavoriteDrinks);
      setUsualIntakeTimes(initCaffeine.frequentDrinkTime);
      setCaffeineInput(initCaffeine.averageDailyCaffeineIntake);
      setValue('averageDailyCaffeineIntake', initCaffeine.averageDailyCaffeineIntake);
    }
  }, [initCaffeine, setValue]);

  const handleSave = async () => {
    const valid = await trigger([
      'age', 'height', 'weight', 'averageDailyCaffeineIntake'
    ]);
    if (!valid) {
      setShowAlertModal(true);
      return;
    }

    onSave({
      gender,
      age: watch('age'),
      height: watch('height'),
      weight: watch('weight'),
      isPregnant,
      isTakingBirthPill,
      isSmoking,
      hasLiverDisease,
      caffeineSensitivity,
      averageDailyCaffeineIntake: watch('averageDailyCaffeineIntake'),
      userFavoriteDrinks,
      frequentDrinkTime,
      sleepTime,
      wakeUpTime,
    });
  };


  return (
    <div className="space-y-6 p-4">
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
            <input type="text" inputMode="numeric"
              value={ageInput}
              onChange={e=>{
                const v=e.target.value.replace(/[^0-9]/g,'');
                setAgeInput(v);
                const num=parseInt(v,10);
                if(!isNaN(num)) setValue('age',num);
                trigger('age');
              }}
              className="w-16 ml-2 mr-1 py-1 text-center border border-[#C7C7CC] rounded-lg text-base focus:outline-none focus:border-[#FE9400]"/>
            <span className="text-base mr-2">세</span>
          </div>
        </div>
        {errors.age && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4"/>{errors.age.message}</p>}

        {/* 신장 */}
        <div className="flex items-center justify-between mt-8">
          <Label className="text-base font-semibold">신장</Label>
          <div className="flex items-center">
            <input type="text" inputMode="numeric"
              value={heightInput}
              onChange={e=>{
                const v=e.target.value.replace(/[^0-9]/g,'');
                setHeightInput(v);
                const num=parseInt(v,10);
                if(!isNaN(num)) setValue('height',num);
                trigger('height');
              }}
              className="w-16 ml-2 mr-1 py-1 text-center border border-[#C7C7CC] rounded-lg text-base focus:outline-none focus:border-[#FE9400]"/>
            <span className="text-base">cm</span>
          </div>
        </div>
        {errors.height && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4"/>{errors.height.message}</p>}

        {/* 체중 */}
        <div className="flex items-center justify-between mt-8">
          <Label className="text-base font-semibold">체중</Label>
          <div className="flex items-center">
            <input type="text" inputMode="decimal"
              value={weightInput}
              onChange={e=>{
                let v=e.target.value.replace(/[^0-9.]/g,'');
                const parts=v.split('.');
                if(parts.length>1){ parts[1]=parts[1].slice(0,1); v=parts[0]+'.'+parts[1]; }
                setWeightInput(v);
                const num=parseFloat(v);
                if(!isNaN(num)) setValue('weight',num);
                trigger('weight');
              }}
              className="w-16 mx-2 py-1 text-center border border-[#C7C7CC] rounded-lg text-base focus:outline-none focus:border-[#FE9400]"/>
            <span className="text-base">kg</span>
          </div>
        </div>
        {errors.weight && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4"/>{errors.weight.message}</p>}
      {/* Boolean 토글 4개 */}
      <div className="grid grid-cols-2 gap-6">
        {[
          { val: isPregnant, setter: setPregnancy, label: '임신 여부' },
          { val: isTakingBirthPill, setter: setBirthControl, label: '피임약 복용' },
          { val: isSmoking, setter: setSmoking, label: '흡연 여부' },
          { val: hasLiverDisease, setter: setHasLiverDisease, label: '간 질환 여부' },
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
        <SliderPrimitive.Root
          className="relative flex items-center mt-10 mb-10 ml-4 mr-8"
          value={[caffeineSensitivity]}
          min={0}
          max={100}
          step={1}
          onValueChange={([v]) => setCaffeineSensitivity(v)}
        >
          <SliderPrimitive.Track className="relative flex-1 h-1 bg-[#AAAAAA]/30 rounded-full">
            <SliderPrimitive.Range className="absolute h-full bg-[#FE9400]" />
          </SliderPrimitive.Track>

          <SliderPrimitive.Thumb className="relative block h-6 w-6 rounded-full bg-white border-2 border-[#FE9400]">
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-[#FE9400] text-white text-xs px-2 py-1 rounded-full">
              {caffeineSensitivity}
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
        <Label className="text-base font-semibold">
          하루 평균 카페인 음료 섭취량
        </Label>
        <div className="flex items-center">
          <input
            type="text"
            inputMode="decimal"
            value={caffeineInput}
            onChange={e => {
              let v = e.target.value.replace(/[^0-9.]/g, '');
              const parts = v.split('.');
              if (parts.length > 1) {
                parts[1] = parts[1].slice(0, 1);
                v = parts[0] + '.' + parts[1];
              }
              setCaffeineInput(v);
              const num = parseFloat(v);
              if (!isNaN(num)) setValue('averageDailyCaffeineIntake', num);
              trigger('averageDailyCaffeineIntake');
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
            items={DRINK_OPTIONS}
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
          onChange={(e) => setUsualIntakeTimes}
          className="
            w-full rounded-lg border border-[#C7C7CC] cursor-pointer
            px-4 py-2 
            focus:outline-none focus:border-[#FE9400]
          "
        />
      </div>

      {/* 수면 시간 */}
      <div>
        <Label className="text-base mb-2 block font-semibold">
          수면 시간
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            type="time"
            step={60}
            placeholder="시작 시간 선택"
            value={sleepTime}
            onChange={(e) => setSleepTime(e.target.value)}
            className="w-1/2 cursor-pointer border-[#C7C7CC] px-4 focus:outline-none focus:border-[#FE9400]"
          />
          <span>~</span>
          <Input
            type="time"
            step={60}
            placeholder="종료 시간 선택"
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
