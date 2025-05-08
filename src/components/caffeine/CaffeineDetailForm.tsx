import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
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
  const dateInputRef = useRef<HTMLInputElement>(null)

  // 소수점 첫째 자리까지 표시
  const caffeineTotal = (selectedSize.caffeineAmount * count).toFixed(1)

  const handleMinus = () => setCount((c) => Math.max(1, c - 1))
  const handlePlus = () => setCount((c) => c + 1)
  const handleSubmit = () => {
    onSubmit({
      drinkId: drink.id,
      drink_size_Id: selectedSize.drinkId,
      drinkCount: count,
      caffeineAmount: parseFloat(caffeineTotal),
      intakeTime: intakeTime.toISOString(),
    })
  }

  // 네이티브 datetime-local picker를 트리거
  const handleDateIconClick = () => {
    if (dateInputRef.current?.showPicker) {
      dateInputRef.current.showPicker()
    } else {
      dateInputRef.current?.click()
    }
  }

  return (
    <div className="flex flex-col h-full px-6 pt-6">
      {/* 음료명 */}
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
        {drink.drinkName}
      </h2>

      {/* 사이즈 선택 */}
      <div className="flex justify-center w-full mb-6 gap-4">
        {sizes.map((size) => {
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
          className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FE9400] text-white hover:opacity-90 transition"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-xl font-medium">{count}</span>
        <button
          onClick={handlePlus}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FE9400] text-white hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 카페인 총량 */}
      <div className="text-center text-2xl font-semibold text-gray-800 mb-6">
        {caffeineTotal} mg
      </div>

      {/* 숨겨진 네이티브 datetime-local input */}
      <input
        type="datetime-local"
        ref={dateInputRef}
        value={format(intakeTime, "yyyy-MM-dd'T'HH:mm")}
        onChange={(e) => setIntakeTime(new Date(e.target.value))}
        className="hidden"
      />

      {/* 시간 아이콘 + 등록 버튼 (가운데 정렬) */}
      <div className="relative mt-auto mb-8 flex justify-center items-center bottom-3">
        {/* 등록 버튼: 화면 중앙 */}
        <Button
            onClick={handleSubmit}
            className="w-50 h-14 gap-0 bg-[#FE9400] text-white rounded-full shadow-lg mx-auto"
        >
            <div className="flex flex-col items-center">
            <span className="text-lg font-medium">카페인 등록하기</span>
            <span className="text-xs opacity-80">
                {format(intakeTime, 'yyyy/MM/dd HH:mm')}
            </span>
            </div>
        </Button>

        {/* 시간 아이콘: 버튼 왼쪽에 절대 위치 */}
        <button
            type="button"
            onClick={handleDateIconClick}
            className="absolute p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            style={{
            top: '50%',
            left: 'calc(50% - 9.5rem - 0.95rem)', 
            transform: 'translateY(-50%)',
            }}
        >
            <Clock className="w-5 h-5 text-gray-600" />
        </button>
        </div>
    </div>
  )
}




