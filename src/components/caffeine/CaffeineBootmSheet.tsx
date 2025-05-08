import * as React from 'react'
import { BottomSheet } from '@/components/common/BottomSheet'
import CaffeineSelectForm, { Drink } from '@/components/caffeine/CaffeineSelectForm'
import CaffeineDetailForm, {
  DrinkDetail,
  CaffeineRecordInput,
} from '@/components/caffeine/CaffeineDetailForm'

// 원시(raw) 음료 데이터 타입
interface RawDrink {
  id: string
  drinkName: string
  type: 'Coffee' | 'Tea' | 'Others'
  cafesName: string
  temperature: 'HOT' | 'ICED' | 'BASIC'
  data: Record<
    string,
    { drinkId: string; caffeineAmount: number; size: string; volume: number }
  >
}

export interface CaffeineBottomSheetProps {
  /** 선택 시트 열기/닫기 */
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 최종 등록 시 호출 */
  onSubmitRecord: (record: CaffeineRecordInput) => void
}

// 예시 raw 데이터 (실제 데이터는 props 등으로 받아오셔도 됩니다)
const drinksRaw: RawDrink[] = [
  {
    id: '1', drinkName: '아메리카노', type: 'Coffee', cafesName: '스타벅스', temperature: 'HOT', data: {
      '1': { drinkId: '1', caffeineAmount: 75, size: 'Regular', volume: 355 },
      '2': { drinkId: '2', caffeineAmount: 150, size: 'Large', volume: 700 },
    }
  },
  {
    id: '2', drinkName: '카페라떼', type: 'Coffee', cafesName: '스타벅스', temperature: 'HOT', data: {
      '3': { drinkId: '3', caffeineAmount: 60.5, size: 'Regular', volume: 355 },
      '4': { drinkId: '4', caffeineAmount: 120.5, size: 'Large', volume: 700 },
      '5': { drinkId: '5', caffeineAmount: 180.5, size: 'Big', volume: 355 },
      '6': { drinkId: '6', caffeineAmount: 240.5, size: 'MoreBig', volume: 700 },
    }
  },
  {
    id: '3', drinkName: '얼그레이 티', type: 'Tea', cafesName: '스타벅스', temperature: 'ICED', data: {
      '5': { drinkId: '5', caffeineAmount: 40, size: 'Tall', volume: 355 },
      '6': { drinkId: '6', caffeineAmount: 80, size: 'Grande', volume: 700 },
      '7': { drinkId: '7', caffeineAmount: 120, size: 'Venti', volume: 1000 },
    }
  },
  {
    id: '4', drinkName: '자몽에이드', type: 'Others', cafesName: '스타벅스', temperature: 'BASIC', data: {
      '8': { drinkId: '8', caffeineAmount: 40, size: 'Tall', volume: 355 },
      '9': { drinkId: '9', caffeineAmount: 80, size: 'Grande', volume: 700 },
      '10': { drinkId: '10', caffeineAmount: 120, size: 'Venti', volume: 1000 },
    }
  }
]

export default function CaffeineBottomSheet({
  open,
  onOpenChange,
  onSubmitRecord,
}: CaffeineBottomSheetProps) {
  // 1) 1차 시트에서 선택한 음료
  const [selected, setSelected] = React.useState<Drink | null>(null)

  // 2) Drink[] 로 매핑 (CaffeineSelectForm 에 넘길 리스트)
  const drinkList: Drink[] = React.useMemo(() =>
    drinksRaw.map(d => {
      const vals = Object.values(d.data).map(x => x.caffeineAmount)
      const min = Math.min(...vals)
      const max = Math.max(...vals)
      return {
        id: d.id,
        drinkName: d.drinkName,
        cafesName: d.cafesName,
        type: d.type,
        temperature: d.temperature,
        caffeineAmount:
          min === max
            ? `${min.toFixed(1)}mg`
            : `${min.toFixed(1)}~${max.toFixed(1)} mg`,
      }
    }),
  [])

  // 3) 선택된 음료의 상세(raw) 데이터를 찾음
  const detail: DrinkDetail | null = React.useMemo(() => {
    if (!selected) return null
    const raw = drinksRaw.find(r => r.id === selected.id)!
    return {
      id: raw.id,
      drinkName: raw.drinkName,
      type: raw.type,
      temperature: raw.temperature,
      data: raw.data,
    }
  }, [selected])

  // 4) 1차 시트 닫힐 때 선택 초기화
  React.useEffect(() => {
    if (!open) setSelected(null)
  }, [open])

  return (
    <>
      {/* ─── 1차 바텀시트: 음료 선택 (height 90%) ─── */}
      <BottomSheet
        open={open}
        onOpenChange={o => {
          onOpenChange(o)
          if (!o) setSelected(null)
        }}
        title="추가할 음료 선택하세요."
        hideConfirm
        contentStyle={{ height: 'calc(var(--vh) * 0.9)', zIndex: 50 }}
      >
        <CaffeineSelectForm
          drinkList={drinkList}
          onSelectDrink={drink => setSelected(drink)}
        />
      </BottomSheet>

      {/* ─── 2차 바텀시트: 상세 등록 (height 50%) ─── */}
      {detail && (
        <BottomSheet
          open={Boolean(selected)}
          onOpenChange={o => {
            if (!o) setSelected(null)
          }}
          hideConfirm
          contentStyle={{ height: 'calc(var(--vh) * 0.7)', zIndex: 60 }}
        >
          <CaffeineDetailForm
            drink={detail}
            onSubmit={record => {
              onSubmitRecord(record)
              // 두 시트 모두 닫기
              onOpenChange(false)
              setSelected(null)
            }}
          />
        </BottomSheet>
      )}
    </>
  )
}






