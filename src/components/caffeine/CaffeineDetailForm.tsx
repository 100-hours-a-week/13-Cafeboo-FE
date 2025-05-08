import { useState, useRef } from 'react'
import { format } from 'date-fns'
import { Clock, Minus, Plus } from 'lucide-react'

export interface DrinkSize {
  drinkId: string
  caffeineAmount: number
  size: string
  volume: number
}

export interface DrinkDetail {
  id: string
  drinkName: string
  type: 'Coffee' | 'Tea' | 'Others'
  temperature: 'HOT' | 'ICED' | 'BASIC'
  data: Record<string, DrinkSize>
}

export interface CaffeineRecordInput {
  drinkId: string
  drink_size_Id: string
  drinkCount: number
  caffeineAmount: number
  intakeTime: string
}

export interface CaffeineDetailFormProps {
  drink: DrinkDetail
  onSubmit: (data: CaffeineRecordInput) => void
}

export default function CaffeineDetailForm({
  drink,
  onSubmit,
}: CaffeineDetailFormProps) {
  const sizes = Object.values(drink.data)
  const [selectedSize, setSelectedSize] = useState<DrinkSize>(sizes[0])
  const [count, setCount] = useState<number>(1)
  const [intakeTime, setIntakeTime] = useState<Date>(new Date())
  const inputRef = useRef<HTMLInputElement>(null)

  // 소수점 첫째 자리까지 표시
  const caffeineTotal = (selectedSize.caffeineAmount * count).toFixed(1)

  const handleMinus = () => setCount(c => Math.max(1, c - 1))
  const handlePlus  = () => setCount(c => Math.min(20, c + 1))
  const handleSubmit = () => {
    onSubmit({
      drinkId: drink.id,
      drink_size_Id: selectedSize.drinkId,
      drinkCount: count,
      caffeineAmount: parseFloat(caffeineTotal),
      intakeTime: intakeTime.toISOString(),
    })
  }

  // 네이티브 피커 띄우기
  const openNativePicker = () => {
    if (inputRef.current?.showPicker) {
      inputRef.current.showPicker()
    } else {
      inputRef.current?.click()
    }
  }

  return (
    <div className="flex flex-col h-full px-6 pt-6 justify-center">
      {/* 음료명 */}
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-8 border-b-2 p-2 border-[#FE9400]">
        {drink.drinkName}
      </h2>

      {/* 사이즈 선택 */}
      <div className="flex justify-center w-full mb-6 gap-4">
        {sizes.map(size => {
          const isSel = size.drinkId === selectedSize.drinkId
          return (
            <button
              key={size.drinkId}
              onClick={() => setSelectedSize(size)}
              className={`flex flex-col items-center p-2 rounded-xl border transition ${
                isSel
                  ? 'bg-[#FE9400]/20 border-[#FE9400]'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-2" />
              <span className="text-sm font-medium text-gray-700">
                {size.size}
              </span>
              <span className="text-xs text-gray-500">
                {size.volume} ml
              </span>
            </button>
          )
        })}
      </div>

      {/* 수량 조절 */}
      <div className="flex items-center justify-center space-x-6 mb-6">
        <button
          onClick={handleMinus}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FE9400] text-white hover:opacity-70 transition"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-xl w-8 text-center">{count}</span>
        <button
          onClick={handlePlus}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FE9400] text-white hover:opacity-70 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 카페인 총량 */}
      <div className="text-center text-2xl font-semibold text-gray-800 mb-6">
        {caffeineTotal} mg
      </div>

      {/* 날짜/시간 네이티브 input (투명하게 겹쳐두기) */}
      <input
        type="datetime-local"
        ref={inputRef}
        value={format(intakeTime, "yyyy-MM-dd'T'HH:mm")}
        onChange={e => setIntakeTime(new Date(e.currentTarget.value))}
        className="absolute"
        style={{
          top: '85%',
          left: 'calc(50% - 150px)',   // 버튼 그룹 중앙 기준, 아이콘 위치만큼 이동
          transform: 'translateY(-50%)',
          width: '2.5rem',
          height: '2.5rem',
          opacity: 0,
          border: 'none',
          padding: 0,
          margin: 0,
          zIndex:100,
        }}
      />

      {/* 시계 아이콘 + 등록 버튼 */}
      <div className="relative mb-8 h-14">
        {/* 등록 버튼: 항상 가로/세로 중앙 */}
        <button
          onClick={handleSubmit}
          className="
            absolute 
            left-1/2 top-1/2 
            transform -translate-x-1/2 -translate-y-1/2
            w-50 h-14 bg-[#FE9400] text-white rounded-full shadow-lg
            flex flex-col items-center justify-center gap-0 cursor-pointer
          "
        >
          <span className="text-xl font-medium">카페인 등록하기</span>
          <span className="text-xs opacity-80">
            {format(intakeTime, 'yyyy/MM/dd HH:mm')}
          </span>
        </button>

        {/* 시계 아이콘: 버튼 왼쪽으로 offset */}
        <button
          type="button"
          onClick={openNativePicker}
          className="
            absolute 
            top-1/2 
            transform -translate-y-1/2
            p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition
            z-10
          "
          style={{
            left: 'calc(50% - 150px)',
          }}
        >
          <Clock className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  )
}









