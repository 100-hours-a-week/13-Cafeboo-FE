import { useState, useMemo } from 'react'
import { Tag } from '@/components/common/Tag'
import { Coffee , Frown, Search } from 'lucide-react'
import EmptyState from '@/components/common/EmptyState'

export interface Drink {
  id: string
  drinkName: string
  cafesName: string
  caffeineAmount: string
  type: 'Coffee' | 'Tea' | 'Others'
  temperature: 'HOT' | 'ICED' | 'BASIC'
}

export interface CaffeineRecord {
  drinkId: string
  intakeTime: string
}

export interface CaffeineSelectFormProps {
  drinkList: Drink[]
  recentRecord?: CaffeineRecord
  onSelectDrink: (drink: Drink) => void
}

const TYPES = ['All', 'Coffee', 'Tea', 'Others'] as const

export default function CaffeineSelectForm({
  drinkList,
  recentRecord,
  onSelectDrink,
}: CaffeineSelectFormProps) {
  const [search, setSearch] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<typeof TYPES[number]>('All')

  // 브랜드 옵션: '기본' + 실제 카페 이름 목록
  const brandOptions = useMemo(() => {
    const names = Array.from(
      new Set(
        drinkList
          .filter(d => d.temperature !== 'BASIC')
          .map(d => d.cafesName)
      )
    )
    return ['기본', ...names]
  }, [drinkList])

  // 브랜드 기본값: '기본'
  const [brandFilter, setBrandFilter] = useState<string>('기본')

  // 필터링 로직
  const filtered = useMemo(() => {
    return drinkList.filter(d => {
      // 타입 필터
      if (typeFilter !== 'All' && d.type !== typeFilter) return false
      // 브랜드 필터
      if (brandFilter === '기본') {
        if (d.temperature !== 'BASIC') return false
      } else {
        if (d.temperature === 'BASIC') return false
        if (d.cafesName !== brandFilter) return false
      }
      // 검색 필터
      if (
        search &&
        !d.drinkName.toLowerCase().includes(search.toLowerCase())
      ) return false
      return true
    })
  }, [drinkList, typeFilter, brandFilter, search])

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
                onChange={e => setSearch(e.target.value)}
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
            onChange={vals => setBrandFilter(vals[0] || '기본')}
            multiple={false}
            scrollable
            className="whitespace-nowrap"
          />

          {/* 타입 필터 */}
          <div className="flex">
            {TYPES.map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`
                  flex-1 text-center py-2 text-sm font-medium
                  border-b-2 transition-colors
                  ${typeFilter === type
                    ? 'border-[#FE9400] text-[#FE9400]'
                    : 'border-gray-200 text-gray-400 hover:text-gray-800'}
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 리스트 영역 */}
        <div className="pb-4 space-y-4">
          {filtered.length === 0 ? (
            <EmptyState
              title="데이터가 없습니다"
              icon={<Coffee size={32}/>}
            />
          ) : (
            filtered.map(drink => (
              <div
                key={drink.id}
                onClick={() => onSelectDrink(drink)}
                className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-none"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-800 text-base">
                      {drink.drinkName}
                    </span>
                    {drink.temperature !== 'BASIC' && (
                      <span
                        className={`text-xs font-medium px-1.5 rounded-full border ${
                          drink.temperature === 'ICED'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-red-600 text-red-600'
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
  )
}


