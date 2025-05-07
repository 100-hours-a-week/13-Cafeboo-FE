import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface TagProps {
  items: string[]
  value: string[]
  onChange: (newValue: string[]) => void
  multiple?: boolean
  scrollable?: boolean     
  className?: string
}

export function Tag({
  items,
  value,
  onChange,
  multiple = true,
  scrollable = false,
  className = '',
}: TagProps) {
  // 스크롤 가능 모드 vs 일반 래핑 모드용 클래스
  const containerClasses = scrollable
    ? `overflow-x-auto scrollbar-none ${className}`
    : `flex-wrap flex items-center gap-2 ${className}`

  const toggleGroupClass = scrollable
    ? 'flex-nowrap flex items-center space-x-2'
    : 'flex-wrap flex items-center gap-2'

  return (
    <div className={containerClasses}>
      {multiple ? (
        <ToggleGroup
          type="multiple"
          value={value}
          onValueChange={val => onChange(val ?? [])}
          className={toggleGroupClass}
        >
          {items.map(item => (
            <ToggleGroupItem
              key={item}
              value={item}
              className="inline-flex items-center justify-center w-auto min-w-0 flex-none px-3 py-1 h-7 !rounded-full border border-[#C7C7CC] text-sm text-[#333333] whitespace-nowrap data-[state=on]:border-[#FF9B17] data-[state=on]:bg-[#FF9B17]/20 data-[state=on]:text-[#333333]"
            >
              {item}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      ) : (
        <ToggleGroup
          type="single"
          value={value[0] ?? ''}
          onValueChange={val => onChange(val ? [val] : [])}
          className={toggleGroupClass}
        >
          {items.map(item => (
            <ToggleGroupItem
              key={item}
              value={item}
              className="inline-flex items-center justify-center w-auto min-w-0 flex-none px-3 py-1 h-7 !rounded-full border border-[#C7B39C] text-sm text-[#595959] whitespace-nowrap data-[state=on]:bg-[#FF9B17] data-[state=on]:text-white"
            >
              {item}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
    </div>
  )
}

