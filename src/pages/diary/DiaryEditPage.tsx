import { useState, useMemo } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import PageLayout from '@/layout/PageLayout';
import { BottomSheet } from '@/components/common/BottomSheet';
import CaffeineSelectForm from '@/components/caffeine/CaffeineSelectForm';
import CaffeineDetailForm, { DrinkDetail } from '@/components/caffeine/CaffeineDetailForm';
import type { CaffeineIntakeRequestDTO } from "@/api/caffeine/caffeine.dto";
import drinkData from '@/data/cafe_drinks.json';
import { useUpdateCaffeineIntake, useDeleteCaffeineIntake } from '@/api/caffeine/caffeineApi';
import type { UpdateCaffeineIntakeRequestDTO } from '@/api/caffeine/caffeine.dto';
import AlertModal from '@/components/common/AlertModal';
import { Info } from 'lucide-react';

interface ApiRecord {
  intakeId: string;
  drinkId: string;
  drinkName: string;
  drinkCount: number;
  caffeineMg: number;
  intakeTime: string; 
}

export default function DiaryEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const orig = (location.state as { record?: ApiRecord })?.record;
  if (!orig) {
    return <Navigate to="/main/diary" replace />;
  }

  const {
    mutateAsyncFn: updateCaffeine,
    isLoading: isUpdating,
  } = useUpdateCaffeineIntake(orig.intakeId);
  
  const {
    mutateAsyncFn: deleteIntakeAsync,
    isLoading: isDeleting,
  } = useDeleteCaffeineIntake(orig.intakeId);

  const [drinkId, setDrinkId] = useState<string>(orig.drinkId);
  const [drinkName, setDrinkName] = useState(orig.drinkName);
  const [date, setDate]           = useState(orig.intakeTime.slice(0, 10));
  const [time, setTime]           = useState(orig.intakeTime.slice(11, 16));
  const [count, setCount]         = useState(String(orig.drinkCount));
  const [amount, setAmount]       = useState(orig.caffeineMg);
  const [size, setSize]           = useState('');

  const [selectOpen, setSelectOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [selectedDrink, setSelectedDrink] = useState<{ cafeName: string; drinkId: number } | null>(null);

  const detail: DrinkDetail | null = useMemo(() => {
    if (!selectedDrink) return null;
    const cafe = drinkData.find(c => c.cafeName === selectedDrink.cafeName);
    const d = cafe?.drinks.find(dd => dd.drinkId === selectedDrink.drinkId);
    if (!d) return null;
    return {
      drinkid: d.drinkId,
      name: d.name,
      cafeName: selectedDrink.cafeName,
      sizes: d.sizes.map(s => ({
        drinkSizeId: s.drinkSizeId,
        size: s.size,
        capacity_ml: s.capacity_ml,
        caffeine_mg: s.caffeine_mg
      }))
    };
  }, [selectedDrink]);

  const openDetail = () => {
    if (!selectedDrink) {
      for (const cafe of drinkData) {
        if (cafe.drinks.some(d => d.drinkId === Number(drinkId))) {
          setSelectedDrink({ cafeName: cafe.cafeName, drinkId: Number(drinkId) });
          break;
        }
      }
    }
    setDetailOpen(true);
  };

  const handleUpdate = async () => {
    const payload: UpdateCaffeineIntakeRequestDTO = {};
    if (drinkId !== orig.drinkId) payload.drinkId = drinkId;
    const iso = `${date}T${time}`;
    if (iso !== orig.intakeTime) payload.intakeTime = iso;
    const nCount = Number(count);
    if (nCount !== orig.drinkCount) payload.drinkCount = nCount;
    if (amount !== orig.caffeineMg) payload.caffeineAmount = amount;
    if (size) payload.drinkSize = size;
    if (Object.keys(payload).length === 0) {
      alert('변경된 내용이 없습니다.');
      return;
    }

    try {
      await updateCaffeine(payload);
      navigate('/main/diary');
    } catch(err:any) {
      setAlertMessage(err.message ?? '수정에 실패했습니다.');
      setIsAlertOpen(true);
    }
  };

  // 삭제
  const handleDelete = async () => {
    try {
      await deleteIntakeAsync();
      navigate('/main/diary');
    } catch(err:any) {
      setAlertMessage(err.message ?? '삭제에 실패했습니다.');
      setIsAlertOpen(true);
    }
  };

  // 2차 시트에서 값 받아서 state 업데이트
  const handleSubmitRecord = (rec: CaffeineIntakeRequestDTO) => {
    if (rec.drinkId)     setDrinkId(rec.drinkId.toString());
    if (rec.intakeTime)  { setDate(rec.intakeTime.slice(0,10)); setTime(rec.intakeTime.slice(11,16)); }
    if (rec.drinkCount !== undefined) setCount(String(rec.drinkCount));
    if (rec.caffeineAmount !== undefined) setAmount(Number(rec.caffeineAmount.toFixed(1)));
    if (rec.drinkSize !== undefined) setSize(rec.drinkSize);
    if (detail) setDrinkName(detail.name);
    setDetailOpen(false);
    setSelectOpen(false);
  };

  return (
    <PageLayout headerMode="title" headerTitle="카페인 기록 수정" onBackClick={() => navigate('/main/diary')}  mainClassName="!space-y-6">
        {/* 음료 */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <span className="font-medium">음료</span>
          <button
            className="px-4 py-1 bg-gray-200 rounded cursor-pointer"
            onClick={() => setSelectOpen(true)}
          >
            {drinkName}
          </button>
        </div>

        {/* 날짜·시간 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="font-medium">날짜</span>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="px-4 py-1 bg-gray-200 rounded text-center cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between p-4">
            <span className="font-medium">시간</span>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="px-4 py-1 bg-gray-200 rounded text-center"
            />
          </div>
        </div>

        {/* 카페인 함유량 */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <span className="font-medium">총 카페인량</span>
          <button
            className="px-4 py-1 bg-gray-200 rounded cursor-pointer"
            onClick={openDetail}
          >
            {amount} mg
          </button>
        </div>

        {/* 수정 / 삭제 */}
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="w-full py-3 bg-[#FE9400] text-white rounded-lg font-semibold cursor-pointer"
        >
          {'수정하기'}
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full mt-0 text-red-500 cursor-pointer"
        >
          {'삭제하기'}
        </button>

      {/* 1) 음료 선택 바텀시트 */}
      <BottomSheet open={selectOpen} onOpenChange={setSelectOpen} hideConfirm>
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

