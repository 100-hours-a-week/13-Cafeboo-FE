import { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export type PeriodType = 'weekly' | 'monthly' | 'yearly';

interface PeriodFilterSelectorProps {
  period: PeriodType;
  selectedYear: string;
  selectedMonth?: string;
  selectedWeek?: string;
  weeksofMonth?: number;
  onYearChange: (year: string) => void;
  onMonthChange?: (month: string) => void;
  onWeekChange?: (week: string) => void;
}

export default function PeriodFilterSelector({
  period,
  selectedYear,
  selectedMonth,
  selectedWeek,
  weeksofMonth,
  onYearChange,
  onMonthChange,
  onWeekChange,
}: PeriodFilterSelectorProps) {
  // 오늘 날짜 기준 기본값

  const years = useMemo(
    () => Array.from({ length: 51 }, (_, i) => `${2025 + i}년`),
    []
  );

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => `${i + 1}월`),
    []
  );

  // 동적으로 생성되는 주차 옵션
  const weeks = useMemo(
    () =>
      Array.from({ length: weeksofMonth as number }, (_, i) => `${i + 1}주차`),
    [weeksofMonth]
  );

  const yearValue = selectedYear;
  const monthValue = selectedMonth;
  const weekValue = selectedWeek;

  const firstWeek = weeks[0];

  // 변경 핸들러 래핑
  const handleYear = (y: string) => {
    onYearChange(y.replace('년', ''));
    if (period === 'weekly' && onWeekChange) {
      onWeekChange(firstWeek);
    }
  };

  const handleMonth = (m: string) => {
    onMonthChange?.(m.replace('월', ''));
    if (period === 'weekly' && onWeekChange) {
      onWeekChange(firstWeek);
    }
  };

  const handleWeek = (w: string) => {
    onWeekChange?.(w.replace('주차', ''));
  };

  // 공통 버튼 스타일
  const triggerClass =
    'flex items-center justify-between w-28 px-3 py-2 shadow-sm' +
    'bg-white border border-[#dadcdf] rounded-lg ' +
    'text-[#333333] font-medium hover:bg-gray-50 focus:outline-none';

  return (
    <div className="flex space-x-3">
      {/* 연도 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={triggerClass}>
            {yearValue}
            <ChevronDown size={16} className="ml-1" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-28 max-h-60 overflow-auto">
          {years.map((y) => (
            <DropdownMenuItem
              key={y}
              onSelect={() => handleYear(y)}
              className={
                y === yearValue
                  ? 'bg-gray-100 text-[#333333] font-medium'
                  : 'text-[#333333]'
              }
            >
              {y}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 월 (weekly, monthly일 때만) */}
      {(period === 'weekly' || period === 'monthly') && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={triggerClass}>
              {monthValue}
              <ChevronDown size={16} className="ml-1" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-28 max-h-60 overflow-auto">
            {months.map((m) => (
              <DropdownMenuItem
                key={m}
                onSelect={() => handleMonth(m)}
                className={
                  m === monthValue
                    ? 'bg-gray-100 text-[#333333] font-medium'
                    : 'text-[#333333]'
                }
              >
                {m}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* 주차 (weekly일 때만) */}
      {period === 'weekly' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={triggerClass}>
              {weekValue}
              <ChevronDown size={16} className="ml-1" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-28 max-h-60 overflow-auto">
            {weeks.map((w) => (
              <DropdownMenuItem
                key={w}
                onSelect={() => handleWeek(w)}
                className={
                  w === weekValue
                    ? 'bg-gray-100 text-[#333333] font-medium'
                    : 'text-[#333333]'
                }
              >
                {w}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
