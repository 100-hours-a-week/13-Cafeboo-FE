import PageLayout from '@/layout/PageLayout';
import { BottomSheet } from '@/components/common/BottomSheet';
import CaffeineSelectForm from '@/components/caffeine/CaffeineSelectForm';
import CaffeineDetailForm from '@/components/caffeine/CaffeineDetailForm';
import AlertModal from '@/components/common/AlertModal';
import { Info } from 'lucide-react';

import DrinkSelectSection from '@/components/diary/sections/DrinkSelectSection';
import DateTimeInputSection from '@/components/diary/sections/DateTimeInputSection';
import CaffeineAmountSection from '@/components/diary/sections/CaffeineAmountSection';

import type { DrinkDetail } from '@/components/caffeine/CaffeineDetailForm';

interface DiaryEditUIPageProps {
  drinkId: string;
  drinkName: string;
  date: string;
  time: string;
  count: string;
  amount: number;
  size: string;
  detail: DrinkDetail | null;
  selectOpen: boolean;
  detailOpen: boolean;
  drinkData: typeof import('@/data/cafe_drinks.json');
  handlers: {
    setDate: (date: string) => void;
    setTime: (time: string) => void;
    setCount: (count: string) => void;
    openDetail: () => void;
    setSelectOpen: (open: boolean) => void;
    setDetailOpen: (open: boolean) => void;
    setIsAlertOpen: (open: boolean) => void;
    handleUpdate: () => void;
    handleDelete: () => void;
    handleSubmitRecord: (rec: any) => void;
    setSelectedDrink: (drink: { cafeName: string; drinkId: number } | null) => void;
  };
  status: {
    isUpdating: boolean;
    isDeleting: boolean;
    isAlertOpen: boolean;
    alertMessage: string;
  };
}

export default function DiaryEditPageUI({
  drinkId,
  drinkName,
  date,
  time,
  count,
  amount,
  size,
  detail,
  selectOpen,
  detailOpen,
  drinkData,
  handlers,
  status,
}: DiaryEditUIPageProps) {
  const {
    setDate,
    setTime,
    setCount,
    openDetail,
    setSelectOpen,
    setDetailOpen,
    setIsAlertOpen,
    handleUpdate,
    handleDelete,
    handleSubmitRecord,
    setSelectedDrink,
  } = handlers;

  const { isUpdating, isDeleting, isAlertOpen, alertMessage } = status;

  return (
    <PageLayout headerMode="title" headerTitle="카페인 기록 수정" onBackClick={() => window.history.back()} mainClassName="!space-y-6">
      <DrinkSelectSection drinkName={drinkName} onOpenSelect={() => setSelectOpen(true)} />

      <DateTimeInputSection date={date} time={time} setDate={setDate} setTime={setTime} />

      <CaffeineAmountSection amount={amount} onOpenDetail={openDetail} />

      <button
        onClick={handleUpdate}
        disabled={isUpdating}
        className="w-full py-3 bg-[#FE9400] text-white rounded-lg font-semibold cursor-pointer"
      >
        수정하기
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="w-full mt-0 text-red-500 cursor-pointer"
      >
        삭제하기
      </button>

      {/* 1) 음료 선택 바텀시트 */}
      <BottomSheet open={selectOpen} onOpenChange={setSelectOpen} title="추가할 음료 선택하세요." hideConfirm>
        <CaffeineSelectForm
          drinkData={drinkData}
          onSelectDrink={(cafeName, dId) => {
            setSelectedDrink({ cafeName, drinkId: dId });
            setSelectOpen(false);
            setDetailOpen(true);
          }}
        />
      </BottomSheet>

      {/* 2) 상세 입력 바텀시트 */}
      {detail && (
        <BottomSheet open={detailOpen} onOpenChange={setDetailOpen} hideConfirm>
          <CaffeineDetailForm
            drink={detail}
            initial={{
              drinkId: String(drinkId),
              drinkSize: detail.sizes[0].size,
              intakeTime: `${date}T${time}`,
              drinkCount: Number(count),
              caffeineAmount: amount
            }}
            onSubmit={handleSubmitRecord}
          />
        </BottomSheet>
      )}

      <AlertModal
        isOpen={isAlertOpen}
        icon={<Info size={36} className="text-[#FE9400]" />}
        title="데이터 전송 오류"
        message={alertMessage}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => setIsAlertOpen(false)}
        confirmText="확인"
        showCancelButton={false}
      />
    </PageLayout>
  );
}

