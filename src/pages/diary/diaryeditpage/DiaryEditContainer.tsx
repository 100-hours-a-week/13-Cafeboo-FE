import { useState, useMemo } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import drinkData from '@/data/cafe_drinks.json';
import {
  useUpdateCaffeineIntake,
  useDeleteCaffeineIntake,
} from '@/api/caffeine/caffeineApi';
import type {
  UpdateCaffeineIntakeRequestDTO,
  CaffeineIntakeRequestDTO,
} from '@/api/caffeine/caffeine.dto';
import DiaryEditPageUI from '@/pages/diary/diaryeditpage/DiaryEditPageUI';
import type { DrinkDetail } from '@/components/caffeine/CaffeineDetailForm';

interface ApiRecord {
  intakeId: string;
  drinkId: string;
  drinkName: string;
  drinkCount: number;
  caffeineMg: number;
  intakeTime: string;
}

export default function DiaryEditContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const orig = (location.state as { record?: ApiRecord })?.record;
  if (!orig) {
    return <Navigate to="/diary" replace />;
  }

  const { mutateAsyncFn: updateCaffeine, isLoading: isUpdating } =
    useUpdateCaffeineIntake(orig.intakeId);
  const { mutateAsyncFn: deleteIntakeAsync, isLoading: isDeleting } =
    useDeleteCaffeineIntake(orig.intakeId);

  const [drinkId, setDrinkId] = useState<string>(orig.drinkId);
  const [drinkName, setDrinkName] = useState(orig.drinkName);
  const [date, setDate] = useState(orig.intakeTime.slice(0, 10));
  const [time, setTime] = useState(orig.intakeTime.slice(11, 16));
  const [count, setCount] = useState(String(orig.drinkCount));
  const [amount, setAmount] = useState(orig.caffeineMg);
  const [size, setSize] = useState('');

  const [selectOpen, setSelectOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [selectedDrink, setSelectedDrink] = useState<{
    cafeName: string;
    drinkId: number;
  } | null>(null);

  const detail: DrinkDetail | null = useMemo(() => {
    if (!selectedDrink) return null;
    const cafe = drinkData.find((c) => c.cafeName === selectedDrink.cafeName);
    const d = cafe?.drinks.find((dd) => dd.drinkId === selectedDrink.drinkId);
    if (!d) return null;
    return {
      drinkid: d.drinkId,
      name: d.name,
      cafeName: selectedDrink.cafeName,
      temperature: d.temperature,
      sizes: d.sizes.map((s) => ({
        drinkSizeId: s.drinkSizeId,
        size: s.size,
        capacity_ml: s.capacity_ml,
        caffeine_mg: s.caffeine_mg,
      })),
    };
  }, [selectedDrink]);

  const openDetail = () => {
    if (!selectedDrink) {
      for (const cafe of drinkData) {
        if (cafe.drinks.some((d) => d.drinkId === Number(drinkId))) {
          setSelectedDrink({
            cafeName: cafe.cafeName,
            drinkId: Number(drinkId),
          });
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
      navigate('/diary');
    } catch (err: any) {
      setAlertMessage(err.message ?? '수정에 실패했습니다.');
      setIsAlertOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIntakeAsync();
      navigate('/diary');
    } catch (err: any) {
      setAlertMessage(err.message ?? '삭제에 실패했습니다.');
      setIsAlertOpen(true);
    }
  };

  const handleSubmitRecord = (rec: CaffeineIntakeRequestDTO) => {
    if (rec.drinkId) setDrinkId(rec.drinkId.toString());
    if (rec.intakeTime) {
      setDate(rec.intakeTime.slice(0, 10));
      setTime(rec.intakeTime.slice(11, 16));
    }
    if (rec.drinkCount !== undefined) setCount(String(rec.drinkCount));
    if (rec.caffeineAmount !== undefined)
      setAmount(Number(rec.caffeineAmount.toFixed(1)));
    if (rec.drinkSize !== undefined) setSize(rec.drinkSize);
    if (detail) setDrinkName(detail.name);
    setDetailOpen(false);
    setSelectOpen(false);
  };

  const handlers = {
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
  };

  const status = {
    isUpdating,
    isDeleting,
    isAlertOpen,
    alertMessage,
  };

  return (
    <DiaryEditPageUI
      drinkId={drinkId}
      drinkName={drinkName}
      date={date}
      time={time}
      count={count}
      amount={amount}
      size={size}
      detail={detail}
      selectOpen={selectOpen}
      detailOpen={detailOpen}
      drinkData={drinkData}
      handlers={handlers}
      status={status}
    />
  );
}
