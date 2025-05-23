import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import HorizontalScroller from '@/components/common/HorizontalScroller'; 
import { useEffect, useState } from 'react';

interface TagProps {
  items: string[];
  value: string[];
  onChange: (newValue: string[]) => void;
  multiple?: boolean;
  scrollable?: boolean;
  className?: string;
}

export function Tag({
  items,
  value,
  onChange,
  multiple = true,
  scrollable = false,
  className = '',
}: TagProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 초기 로드 시 화면 크기 확인
    handleResize();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 스크롤 가능 모드 vs 일반 래핑 모드용 클래스
  const containerClasses = scrollable
    ? `overflow-x-auto scrollbar-hide ${className}`
    : `flex-wrap flex items-center gap-2 ${className}`;

  const toggleGroupClass = scrollable
    ? 'flex-nowrap flex items-center space-x-2'
    : 'flex-wrap flex items-center gap-2';

  const content = multiple ? (
    <ToggleGroup
      type="multiple"
      value={value}
      onValueChange={(vals: string[]) => onChange(vals ?? [])}
      className={toggleGroupClass}
    >
      {items.map((item) => (
        <ToggleGroupItem
          key={item}
          value={item}
          className="
            inline-flex items-center justify-center
            w-auto min-w-0 flex-none px-3 py-1 h-7
            !rounded-full border border-[#C7C7CC]
            text-sm text-[#333333] whitespace-nowrap
            data-[state=on]:border-[#FE9400]
            data-[state=on]:bg-[#FE9400]/20
            data-[state=on]:text-[#333333]
          "
        >
          {item}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  ) : (
    <ToggleGroup
      type="single"
      value={value[0] ?? ''}
      onValueChange={(val: string) =>
        onChange(val ? [val] : [])
      }
      className={toggleGroupClass}
    >
      {items.map((item) => (
        <ToggleGroupItem
          key={item}
          value={item}
          className="
            inline-flex items-center justify-center
            w-auto min-w-0 flex-none px-3 py-1 h-7
            !rounded-full border border-[#C7C7CC]
            text-sm text-[#333333] whitespace-nowrap
            data-[state=on]:border-[#FE9400]
            data-[state=on]:bg-[#FE9400]/20
            data-[state=on]:text-[#333333]
            cursor-pointer
          "
        >
          {item}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );

  // scrollable 모드면 HorizontalScroller 로 감싸기
  return scrollable ? (
    <HorizontalScroller className={className}>
      {content}
    </HorizontalScroller>
  ) : (
    <>{content}</>
  );
}
