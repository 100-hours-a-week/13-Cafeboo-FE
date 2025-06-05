import { useState, useMemo } from 'react';
import { Tag, TagItem } from '@/components/common/Tag';
import { Coffee, Search } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import HorizontalScroller from '../common/HorizontalScroller';

interface DrinkSize {
  drinkSizeId: number;
  size: string;
  capacity_ml: number;
  caffeine_mg: number;
}

interface Drink {
  drinkId: number;
  name: string;
  type: 'COFFEE' | 'TEA' | 'OTHER' | '몬스터' | '핫식스' | '레드불'; 
  temperature: 'HOT' | 'ICED' | 'BASIC';
  sizes: DrinkSize[];
}

interface Cafe {
  cafeName: string;
  drinks: Drink[];
}

interface FilteredDrink {
  cafeName: string;
  drinkId: number;
  name: string;
  temperature: string;
  caffeineAmount: string;
}

export interface CaffeineSelectFormProps {
  drinkData: any[]; 
  onSelectDrink: (cafeName: string, drinkId: number) => void;
}

const baseTypes = ['ALL', 'COFFEE', 'TEA', 'OTHER'] as const;
const energyDrinkTypes = ['ALL', '몬스터', '핫식스', '레드불'] as const;

export default function CaffeineSelectForm({
  drinkData,
  onSelectDrink,
}: CaffeineSelectFormProps) {
  const [search, setSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [brandFilter, setBrandFilter] = useState<string>(drinkData[0]?.cafeName || '');

  // ✅ 브랜드 옵션 동적 생성 
  const brandOptions: TagItem[] = useMemo(() => {
    return Array.from(new Set(drinkData.map((cafe) => cafe.cafeName))).map((label) => ({
      label,
      isNew: label === '에너지 드링크', 
    }));
  }, [drinkData]);

  const currentTypes = useMemo(() => {
    return brandFilter === '에너지 드링크' ? energyDrinkTypes : baseTypes;
  }, [brandFilter]);


  // ✅ 필터링 로직 최적화
  const filteredDrinks = useMemo<FilteredDrink[]>(() => {
    if (!brandFilter) return [];
  
    return (
      drinkData
        .find((cafe:Cafe) => cafe.cafeName === brandFilter)
        ?.drinks.filter((drink:Drink) => {
          if (typeFilter !== 'ALL' && drink.type !== typeFilter) return false;
          if (search && !drink.name.toLowerCase().includes(search.toLowerCase())) {
            return false;
          }
          return true;
        })
        .map((drink:Drink) => ({
          cafeName: brandFilter,
          drinkId: drink.drinkId,
          name: drink.name,
          temperature: drink.temperature,
          caffeineAmount:
            drink.sizes.length > 1
              ? `${Math.min(...drink.sizes.map((s) => s.caffeine_mg)).toFixed(1)} ~ ${Math.max(
                  ...drink.sizes.map((s) => s.caffeine_mg)
                ).toFixed(1)} mg`
              : `${drink.sizes[0].caffeine_mg.toFixed(1)} mg`,
        })) ?? []
    );
  }, [drinkData, search, typeFilter, brandFilter]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* 상단 고정 영역 */}
        <div className="sticky top-0 z-10 space-y-4 p-1 bg-white mb-2">
          {/* 검색 입력 */}
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FE9400]"
              size={18}
            />
            <input
              type="text"
              placeholder="메뉴 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                pl-10 pr-4 py-2
                rounded-full
                border border-[#FE9400]
                border-2
                bg-white
                text-base text-black
                placeholder-gray-400
                focus:outline-none focus:ring-0
                "
            />
          </div>

          {/* 브랜드 필터 */}
          <Tag
            items={brandOptions}
            value={[brandFilter]}
            onChange={(vals) => setBrandFilter(vals[0] || brandOptions[0].label)}
            multiple={false}
            scrollable
            className="whitespace-nowrap"
          />

          {/* 타입 필터 */}
          <div className="flex">
            {currentTypes .map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`
                  flex-1 text-center py-2 text-sm font-medium
                  border-b-2 transition-colors
                  ${
                    typeFilter === type
                      ? 'border-[#FE9400] text-[#FE9400]'
                      : 'border-gray-200 text-gray-400 hover:text-gray-800'
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 리스트 영역 */}
        <div className="pb-4 space-y-4">
          {filteredDrinks.length === 0 ? (
            <EmptyState title="데이터가 없습니다" icon={<Coffee size={32} />} />
          ) : (
            filteredDrinks.map((drink) => (
              <div
                key={drink.drinkId}
                onClick={() => onSelectDrink(drink.cafeName, drink.drinkId)}
                className="flex items-center justify-between px-2 pt-1 pb-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-none"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-800 text-base">
                      {drink.name}
                    </span>
                    {drink.temperature !== 'BASIC' && (
                      <span
                        className={`text-xs font-medium px-1.5 rounded-full border ${
                          drink.temperature === 'HOT'
                            ? 'border-red-600 text-red-600'
                            : 'border-blue-600 text-blue-600'
                        }`}
                      >
                        {drink.temperature.toUpperCase()}
                      </span>
                    )}
                  </div>
                  {/* 카페인량만 표시 */}
                  <div className="text-sm text-gray-500 mt-1">
                    {drink.caffeineAmount}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
