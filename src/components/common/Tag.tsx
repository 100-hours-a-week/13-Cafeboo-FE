import { useEffect, useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import HorizontalScroller from '@/components/common/HorizontalScroller';

export interface TagItem {
  label: string;
  isNew?: boolean;
}

interface TagProps {
  items: TagItem[];
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
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerClasses = scrollable
    ? `overflow-x-auto scrollbar-hide ${className}`
    : `flex-wrap flex items-center gap-2 ${className}`;

  const toggleGroupClass = scrollable
    ? 'flex-nowrap flex items-center space-x-2 pt-2'
    : 'flex-wrap flex items-center gap-2 pt-2';

  const content = multiple ? (
    <ToggleGroup
      type="multiple"
      value={value}
      onValueChange={(val: string[]) => onChange(val ?? [])}
      className={toggleGroupClass}
    >
      {items.map(({ label, isNew }) => (
        <div key={label} className="relative">
          <ToggleGroupItem
            value={label}
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
            {label}
            {isNew && (
            <span className="absolute -top-1 -right-1 bg-[#FF3B30] text-white text-[10px] px-1.5 py-[1px] rounded-full">
              new!
            </span>
          )}
          </ToggleGroupItem>
        </div>
      ))}
    </ToggleGroup>
  ) : (
    <ToggleGroup
      type="single"
      value={value[0] ?? ''}
      onValueChange={(val: string) => onChange(val ? [val] : [])}
      className={toggleGroupClass}
    >
      {items.map(({ label, isNew }) => (
        <div key={label} className="relative">
          <ToggleGroupItem
            value={label}
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
            {label}
            {isNew && (
            <span className="absolute -top-1.5 -right-[-5px] bg-[#FF3B30] text-white text-[8px] [animation:pulseScale_2s_infinite] px-1 py-[0.5px] rounded-full">
              new!
            </span>
          )}
          </ToggleGroupItem>
        </div>
      ))}
    </ToggleGroup>
  );

  return scrollable ? (
    <HorizontalScroller className={containerClasses}>{content}</HorizontalScroller>
  ) : (
    <div className={containerClasses}>{content}</div>
  );
}


