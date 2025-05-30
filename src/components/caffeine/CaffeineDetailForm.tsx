import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Clock, Minus, Plus } from 'lucide-react';
import Small from '@/assets/small.png';
import Medium from '@/assets/medium.png';
import Large from '@/assets/large.png';
import ExtraLarge from '@/assets/extralarge.png';
import Stick from '@/assets/stick.png';  
import type { CaffeineIntakeRequestDTO } from "@/api/caffeine/caffeine.dto";

interface DrinkSize {
  drinkSizeId: number;
  caffeine_mg: number;
  size: string;
  capacity_ml: number;
}

export interface DrinkDetail {
  drinkid: number;
  name: string;
  sizes: DrinkSize[];
  date?: string;
  cafeName: string;
}

export interface CaffeineDetailFormProps {
  drink: DrinkDetail;
  onSubmit: (data: CaffeineIntakeRequestDTO) => void;
  initial?: CaffeineIntakeRequestDTO;
}

export default function CaffeineDetailForm({
  drink,
  onSubmit,
}: CaffeineDetailFormProps) {
  const sizes = drink.sizes;
  const [selectedSize, setSelectedSize] = useState<DrinkSize>(sizes[0]);
  const [count, setCount] = useState<number>(1);
  const todayString = new Date().toISOString().slice(0, 10);
  const initialDate =
  drink.date && drink.date !== todayString
    ? new Date(`${drink.date}T12:00`)
    : new Date();
  
  const [intakeTime, setIntakeTime] = useState<Date>(initialDate);
  const inputRef = useRef<HTMLInputElement>(null);

  const isMixCoffee = drink.cafeName === '믹스커피';

  // 이미지 배열 생성
  const sizeImages: string[] = isMixCoffee
    ? [Stick]                          
    : (() => {
        const imgs = [Medium, Large, ExtraLarge];
        if (sizes.length === 4) imgs.unshift(Small);
        return imgs;
      })();

  // 카페인 총량 계산 (소수점 첫째 자리까지)
  const caffeineTotal = (selectedSize.caffeine_mg * count).toFixed(1);

  // 수량 조절 핸들러
  const handleMinus = () => setCount((c) => Math.max(1, c - 1));
  const handlePlus = () => setCount((c) => Math.min(20, c + 1));

  // 등록 핸들러
  const handleSubmit = () => {
    onSubmit({
      drinkId: drink.drinkid.toString(),
      drinkSize: selectedSize.size,
      drinkCount: count,
      caffeineAmount: parseFloat(caffeineTotal),
      intakeTime: format(intakeTime, "yyyy-MM-dd'T'HH:mm"),
    });
  };

  // 네이티브 날짜/시간 피커 열기
  const openNativePicker = () => {
    if (inputRef.current?.showPicker) {
      inputRef.current.showPicker();
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-full px-6 pt-6 justify-center">
      {/* 음료명 */}
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-8 border-b-2 p-2 border-[#FE9400]">
        {drink.name}
      </h2>

      {/* 사이즈 선택 */}
      <div className="flex justify-center w-full mb-6 gap-4">
        {sizes.map((size, index) => {
          const isSelected = size.drinkSizeId === selectedSize.drinkSizeId;
          const imgSrc = sizeImages[index];
          return (
            <button
              key={size.drinkSizeId}
              onClick={() => setSelectedSize(size)}
              className={`flex flex-col items-center p-2 rounded-xl border transition ${
                isSelected
                  ? 'bg-[#FE9400]/20 border-[#FE9400] border-1'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <img
                src={imgSrc}
                alt={`${size.size} cup`}
                className="w-12 mb-2 h-auto"
              />
              <span className="text-sm font-medium text-gray-700">
                {size.size}
              </span>
              <span className="text-xs text-gray-500">{size.capacity_ml} ml</span>
            </button>
          );
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

      {/* 등록 버튼 */}
      <div className="relative mb-8 h-14">
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

        {/* 시계 아이콘 */}
        <label className="relative w-11 h-11 block cursor-pointer left-1/2 transform -translate-x-[150px] top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer">
          <Clock className="absolute p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 w-9 h-9 z-10 flex items-center justify-center" />
          <input
            id="intakeTime"
            type="datetime-local"
            ref={inputRef}
            value={format(intakeTime, "yyyy-MM-dd'T'HH:mm")}
            onChange={e => setIntakeTime(new Date(e.currentTarget.value))}
            onClick={openNativePicker}
            className="absolute inset-0 w-4 h-4 opacity-0"
          />
        </label>
      </div>
    </div>
  );
}

