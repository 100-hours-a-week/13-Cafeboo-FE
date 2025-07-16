import { useState, useMemo } from 'react';
import CaffeineBottomSheet from '@/components/caffeine/CaffeineBottomSheet';
import drinkData from '@/data/cafe_drinks.json';

interface Selected {
  cafeName: string;
  drinkId: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitRecord: (record: any) => void;
  selectedDate?: string; 
}

export default function CaffeineBottomSheetContainer({ open, onOpenChange, onSubmitRecord, selectedDate }: Props) {
  const [selected, setSelected] = useState<Selected | null>(null);

  const detail = useMemo(() => {
    if (!selected) return null;

    const cafe = drinkData.find(cafe => cafe.cafeName === selected.cafeName);
    if (!cafe) return null;

    const drink = cafe.drinks.find(d => d.drinkId === selected.drinkId);
    if (!drink) return null;

    return {
      drinkid: drink.drinkId,
      name: drink.name,
      cafeName: selected.cafeName,
      sizes: drink.sizes.map(size => ({
        drinkSizeId: size.drinkSizeId,
        caffeine_mg: size.caffeine_mg,
        size: size.size,
        capacity_ml: size.capacity_ml,
      })),
      date: selectedDate,
      temperature: drink.temperature,
    };
  }, [selected, selectedDate]);

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) setSelected(null);
  };

  const handleSubmitRecord = (record: any) => {
    onSubmitRecord(record);
    onOpenChange(false);
    setSelected(null);
  };

  return (
    <CaffeineBottomSheet
      open={open}
      detail={detail}
      onSelectDrink={setSelected}
      onOpenChange={handleOpenChange}
      onSubmitRecord={handleSubmitRecord}
    />
  );
}

