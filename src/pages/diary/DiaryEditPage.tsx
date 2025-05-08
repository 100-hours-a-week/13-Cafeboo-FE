import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CaffeineBottomSheet from '@/components/caffeine/CaffeineBootmSheet';
import type { CaffeineRecordInput } from '@/components/caffeine/CaffeineDetailForm';

export default function DiaryEdit() {
  const navigate = useNavigate();
  const [drink, setDrink] = useState('아메리카노');
  const [date, setDate] = useState('2025-09-03');
  const [time, setTime] = useState('12:15');
  const [amount, setAmount] = useState('150');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleUpdate = () => {
    // TODO: API 호출
    navigate('/main/diary');
  };
  const handleDelete = () => {
    // TODO: API 호출
    navigate('/main/diary');
  };

  const handleSubmitRecord = (record: CaffeineRecordInput) => {
    console.log('최종 카페인 기록:', record);
    setIsSheetOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Header
        mode="title"
        title="카페인 기록 수정"
        onBackClick={() => navigate('/main/diary')}
      />

      <main className="pt-16 space-y-6">
        {/* 음료 */}
        <div className="flex items-center justify-between rounded-lg shadow-sm border border-gray-200 p-4">
          <span className="font-medium">음료</span>
          <button
            className="px-4 bg-gray-200 rounded-md cursor-pointer py-1"
            onClick={() => setIsSheetOpen(true)}
          >
            {drink}
          </button>
        </div>

        {/* 날짜·시간 묶음 */}
        <div className="rounded-lg shadow-sm border border-gray-200">
          {/* 날짜 */}
          <div className="p-4 flex items-center justify-between border-b border-gray-200">
            <span className="font-medium">날짜</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-gray-200 rounded-md text-center px-4 py-1"
            />
          </div>
          {/* 시간 */}
          <div className="p-4 flex items-center justify-between">
            <span className="font-medium">시간</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-gray-200 rounded-md text-center px-4 py-1"
            />
          </div>
        </div>

        {/* 카페인 함유량 */}
        <div className="flex items-center justify-between rounded-lg shadow-sm border border-gray-200 p-4">
          <span className="font-medium">카페인 함유량</span>
          <div className="flex items-center space-x-1 px-4 bg-gray-200 rounded-md cursor-pointer py-1">
            <button onClick={() => setIsSheetOpen(true)}>{amount}</button>
            <span className="text-base">mg</span>
          </div>
        </div>

        {/* 수정·삭제 버튼 */}
        <button
          onClick={handleUpdate}
          className="w-full py-3 h-12 rounded-lg bg-[#FE9400] text-[#FEFBF8] text-lg font-semibold mt-2 cursor-pointer"
        >
          수정하기
        </button>
        <button
          onClick={handleDelete}
          className="w-full text-center text-red-500 cursor-pointer"
        >
          삭제하기
        </button>
      </main>
      <CaffeineBottomSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmitRecord={handleSubmitRecord}
      />
    </div>
  );
}
