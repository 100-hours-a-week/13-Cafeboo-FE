import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface TwoOptionToggleProps<T extends string> {
  options: { label: string; value: T }[]; 
  value: T;
  onChange: (value: T) => void;
}

export default function TwoOptionToggle<T extends string>({
  options,
  value,
  onChange,
}: TwoOptionToggleProps<T>) {
  return (
    <ToggleGroup
      type="single"
      value={String(value)} 
      onValueChange={(v) => {
        if (v) onChange(v as T);
      }}
      className="flex w-full"
    >
      {options.map(({ label, value: val }, idx) => (
        <ToggleGroupItem
          key={val}
          value={val}
          className={`
            flex-1 py-2 text-sm font-medium text-center cursor-pointer
            border border-[#D9D9D9]
            ${idx === 0 ? 'rounded-l-lg' : ''}
            ${idx === 1 ? 'rounded-r-lg' : ''}
            data-[state=on]:bg-white
            data-[state=on]:border-[#FE9400]
            data-[state=on]:text-[#333333]
            data-[state=off]:bg-[#F1F3F3]
            data-[state=off]:text-[#595959]
            ${idx === 0 ? 'data-[state=off]:border-r-0' : ''}
            ${idx === 1 ? 'data-[state=off]:border-l-0' : ''}
          `}
        >
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}


