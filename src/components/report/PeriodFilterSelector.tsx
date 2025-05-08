'use client';

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
  selectedYear?: string;
  selectedMonth?: string;
  selectedWeek?: string;
  onYearChange: (year: string) => void;
  onMonthChange?: (month: string) => void;
  onWeekChange?: (week: string) => void;
  onFilterChange: (year: string, month?: string, week?: string) => void;
}

export default function PeriodFilterSelector({
  period,
  selectedYear,
  selectedMonth,
  selectedWeek,
  onYearChange,
  onMonthChange,
  onWeekChange,
  onFilterChange,
}: PeriodFilterSelectorProps) {
  // 오늘 날짜 기준 기본값
  const today = new Date();
  const defaultYear = `${today.getFullYear()}년`;
  const defaultMonth = `${today.getMonth() + 1}월`;

  // 주차 생성: 한 주를 토요일 시작→금요일 끝으로 보고, 해당 월에 몇 주가 있는지 계산
  function getWeekOptions(yearNum: number, monthNum: number) {
    const firstDay = new Date(yearNum, monthNum - 1, 1).getDay(); // 0=일,6=토
    const lastDate = new Date(yearNum, monthNum, 0).getDate();
    const offset = (firstDay + 1) % 7;
    const weeksCount = Math.ceil((lastDate + offset) / 7);
    return Array.from({ length: weeksCount }, (_, i) => `${i + 1}주차`);
  }

  // 옵션 배열
  const years = useMemo(
    () => Array.from({ length: 101 }, (_, i) => `${2000 + i}년`),
    []
  );
  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => `${i + 1}월`),
    []
  );
  const numYear = parseInt((selectedYear ?? defaultYear).replace('년', ''), 10);
  const numMonth = parseInt(
    (selectedMonth ?? defaultMonth).replace('월', ''),
    10
  );
  const weeks = useMemo(
    () => getWeekOptions(numYear, numMonth),
    [numYear, numMonth]
  );

  // 화면에 사용할 값 (prop이 없으면 default)
  const yearValue = selectedYear ?? defaultYear;
  const monthValue = selectedMonth ?? defaultMonth;
  const weekValue = selectedWeek ?? weeks[weeks.length - 1]; // 기본: 마지막 주차

  // 변경 핸들러 래핑
  const handleYear = (y: string) => {
    onYearChange(y);
    onFilterChange(y, monthValue, weekValue);
  };
  const handleMonth = (m: string) => {
    onMonthChange?.(m);
    onFilterChange(yearValue, m, weekValue);
  };
  const handleWeek = (w: string) => {
    onWeekChange?.(w);
    onFilterChange(yearValue, monthValue, w);
  };

  // 공통 버튼 스타일
  const triggerClass =
    'flex items-center justify-between w-28 px-3 py-2 shadow-sm' +
    'bg-white border border-gray-200 rounded-lg ' +
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
