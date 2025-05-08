import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tag } from '../common/Tag'

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
  ]

export interface HealthInfoEditorProps {
  onSave: (data: {
    gender: string;
    age: number;
    height: number;
    weight: number;
    pregnancy: boolean;
    birthControl: boolean;
    smoking: boolean;
    liverDisease: boolean;
    caffeineSensitivity: number;
    dailyIntake: number;
    userFavoriteDrinks: string[];
    usualIntakeTimes: string;
    sleepStartTime: string;
    sleepEndTime: string;
  }) => Promise<void>;
}

export default function HealthInfoEditor({ onSave }: HealthInfoEditorProps) {
  // 1) Health 스토어 대신 로컬 state
  const [gender, setGender] = useState<'male'|'female'>('male')
  const [age, setAge] = useState<number>(27)
  const [height, setHeight] = useState<number>(170)
  const [weight, setWeight] = useState<number>(58)
  const [pregnancy, setPregnancy] = useState(false)
  const [birthControl, setBirthControl] = useState(false)
  const [smoking, setSmoking] = useState(false)
  const [liverDisease, setLiverDisease] = useState(false)

  const [caffeineSensitivity, setCaffeineSensitivity] = useState(50)
  const [dailyIntake, setDailyIntake] = useState<number>(2)
  const [userFavoriteDrinks, setUserFavoriteDrinks] = useState<string[]>([])
  const [usualIntakeTimes, setUsualIntakeTimes] = useState('10:00')
  const [sleepStartTime, setSleepStartTime] = useState('22:00')
  const [sleepEndTime, setSleepEndTime] = useState('07:00')


  const handleSave = async () => {
    await onSave({
      gender, age, height, weight,
      pregnancy, birthControl, smoking, liverDisease,
      caffeineSensitivity, dailyIntake,
      userFavoriteDrinks, usualIntakeTimes,
      sleepStartTime, sleepEndTime,
    })
  }

  return (
    <div className="space-y-6 p-4">

      {/* 성별 */}
      <div>
        <Label className="font-semibold mb-2 block text-base">성별</Label>
        <ToggleGroup
          type="single"
          value={gender}
          onValueChange={v => setGender(v as 'male'|'female')}
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
            value={age}
            onChange={e => setAge(+e.target.value)}
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

      {/* 신장 입력 */}
      <div className="flex items-center justify-between mb-8">
        <Label className="text-base text-[#000000] font-semibold">신장</Label>
        <div className="flex items-center">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={height}
            onChange={e => setHeight(+e.target.value)}
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
            value={weight}
            onChange={e => setWeight(+e.target.value)}
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
          { val: pregnancy,    setter: setPregnancy,    label: '임신 여부' },
          { val: birthControl, setter: setBirthControl, label: '피임약 복용' },
          { val: smoking,      setter: setSmoking,      label: '흡연 여부' },
          { val: liverDisease, setter: setLiverDisease, label: '간 질환 여부' },
        ].map(({val, setter, label}) => (
            <div key={label}>
              <Label className="text-[#000000] mb-2 block text-base font-semibold">
                {label}
              </Label>

              <ToggleGroup
                type="single"
                value={val ? 'yes' : 'no'}
                onValueChange={v => setter(v === 'yes')}
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
          ))}
      </div>

      {/* 카페인 민감도 슬라이더 */}
      <div className="mb-10">
        <Label className="text-base text-[#000000] mb-2 block font-semibold">카페인 민감도</Label>
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

          <span className="absolute left-[-15px] text-sm text-[#595959]">0</span>
          <span className="absolute right-[-30px] text-sm text-[#595959]">100</span>
        </SliderPrimitive.Root>
      </div>

      {/* 하루 평균 섭취량 */}

     <div className="flex items-center justify-between mt-10 mb-8">
      <Label className="text-base text-[#000000] font-semibold">하루 평균 카페인 음료 섭취량</Label>
        <div className="flex items-center">
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*[.]?[0-9]*"
          value={dailyIntake}
          onChange={e => setDailyIntake(+e.target.value)}
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

      {/* 선호 음료 */}
      <div className="mt-10">
        <Label className="text-base text-[#000000] mt-4 mb-4 block font-semibold">선호하는 종류(중복 선택 가능)</Label>
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
        <Label className="text-base text-[#000000] mb-2 block font-semibold">가장 자주 마시는 시간대</Label>
        <Input
          type="time"
          step={60}                           
          value={usualIntakeTimes ?? '12:00'}
          onChange={(e) =>setUsualIntakeTimes}
          className="
            w-1/2 rounded-lg border border-[#C7C7CC] cursor-pointer
            px-4 py-2 
            focus:outline-none focus:border-[#FE9400]
          "
        />
      </div>

      {/* 수면 시간 */}
      <div>
        <Label className="text-base text-[#000000] mb-2 block font-semibold">수면 시간</Label>
        <div className="flex items-center space-x-2">
          <Input
            type="time"
            step={60}
            placeholder="시작 시간 선택"
            value={sleepStartTime}
            onChange={e => setSleepStartTime(e.target.value)}
            className="w-1/2 cursor-pointer border-[#C7C7CC] px-4 focus:outline-none focus:border-[#FE9400]"
          />
          <span>~</span>
          <Input
            type="time"
            step={60}
            placeholder="종료 시간 선택"
            value={sleepEndTime}
            onChange={e => setSleepEndTime(e.target.value)}
            className="w-1/2 cursor-pointer border-[#C7C7CC] px-4 focus:outline-none focus:border-[#FE9400]" 
          />
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="py-4">
        <Button onClick={handleSave} className="w-full py-3 h-12 rounded-lg bg-[#FE9400] text-[#FEFBF8] text-lg font-semibold mt-2 cursor-pointer">
          저장하기
        </Button>
      </div>
    </div>
)
}
