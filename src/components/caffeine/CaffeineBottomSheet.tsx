import { BottomSheet } from '@/components/common/BottomSheet';
import CaffeineSelectForm from '@/components/caffeine/CaffeineSelectForm';
import CaffeineDetailForm from '@/components/caffeine/CaffeineDetailForm';
import drinkData from '@/data/cafe_drinks.json';

interface Props {
  open: boolean;
  detail: null | {
    drinkid: number;
    name: string;
    cafeName: string;
    temperature: string;
    sizes: {
      drinkSizeId: number;
      caffeine_mg: number;
      size: string;
      capacity_ml: number;
    }[];
  } | null;
  onSelectDrink: (
    selection: { cafeName: string; drinkId: number } | null
  ) => void;
  onOpenChange: (open: boolean) => void;
  onSubmitRecord: (record: any) => void;
}

export default function CaffeineBottomSheet({
  open,
  detail,
  onSelectDrink,
  onOpenChange,
  onSubmitRecord,
}: Props) {
  return (
    <>
      <BottomSheet
        open={open}
        onOpenChange={onOpenChange}
        title="추가할 음료 선택하세요."
        hideConfirm
        contentStyle={{ height: 'calc(var(--vh, 1vh) * 90)', zIndex: 50 }}
      >
        <CaffeineSelectForm
          drinkData={drinkData}
          onSelectDrink={(cafeName, drinkId) =>
            onSelectDrink({ cafeName, drinkId })
          }
        />
      </BottomSheet>

      {detail && (
        <BottomSheet
          open={Boolean(detail)}
          onOpenChange={() => onSelectDrink(null)}
          hideConfirm
          contentStyle={{ zIndex: 60 }}
        >
          <CaffeineDetailForm drink={detail} onSubmit={onSubmitRecord} />
        </BottomSheet>
      )}
    </>
  );
}
