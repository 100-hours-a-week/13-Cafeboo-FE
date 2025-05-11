import { useState, useEffect, useMemo} from 'react';
import { BottomSheet } from '@/components/common/BottomSheet';
import CaffeineSelectForm from '@/components/caffeine/CaffeineSelectForm';
import CaffeineDetailForm, { CaffeineRecordInput } from '@/components/caffeine/CaffeineDetailForm';
import drinkData from '@/data/cafe_drinks.json';

export interface CaffeineBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitRecord: (record: CaffeineRecordInput) => void;
}

export interface DrinkDetail {
  drinkid: number,
  name: string;
  sizes: {
    drinkSizeId: number;
    caffeine_mg: number;
    size: string;
    capacity_ml: number;
  }[];
}

export default function CaffeineBottomSheet({
  open,
  onOpenChange,
  onSubmitRecord,
}: CaffeineBottomSheetProps) {
  const [selected, setSelected] = useState<{ cafeName: string; drinkId: number } | null>(null);

  const detail: DrinkDetail | null = useMemo(() => {
    if (!selected) return null;

    const cafe = drinkData.find((cafe) => cafe.cafeName === selected.cafeName);
    if (!cafe) return null;

    const drink = cafe.drinks.find((d) => d.drinkId === selected.drinkId);
    if (!drink) return null;

    return {
      drinkid: drink.drinkId,
      name: drink.name,
      sizes: drink.sizes.map((size) => ({
        drinkSizeId: size.drinkSizeId,
        caffeine_mg: size.caffeine_mg,
        size: size.size,
        capacity_ml: size.capacity_ml,
      })),
    };
  }, [selected]);

  useEffect(() => {
    if (!open) setSelected(null);
  }, [open]);

  return (
    <>
      <BottomSheet
        open={open}
        onOpenChange={(o) => {
          onOpenChange(o);
          if (!o) setSelected(null);
        }}
        title="추가할 음료 선택하세요."
        hideConfirm
        contentStyle={{ height: 'calc(var(--vh) * 0.9)', zIndex: 50 }}
      >
        <CaffeineSelectForm
          drinkData={drinkData}
          onSelectDrink={(cafeName, drinkId) => setSelected({ cafeName, drinkId })}
        />
      </BottomSheet>

      {detail && (
        <BottomSheet
          open={Boolean(selected)}
          onOpenChange={(o) => {
            if (!o) setSelected(null);
          }}
          hideConfirm
          contentStyle={{ zIndex: 60 }}
        >
          <CaffeineDetailForm
            drink={detail}
            onSubmit={(record) => {
              onSubmitRecord(record);
              onOpenChange(false);
              setSelected(null);
            }}
          />
        </BottomSheet>
      )}
    </>
  );
}