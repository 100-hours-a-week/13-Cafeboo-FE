import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TagProps {
  items: string[];
  value: string[]; 
  onChange: (newValue: string[]) => void;
  multiple?: boolean; 
  className?: string;
}

export function Tag({
  items,
  value,
  onChange,
  multiple = true,
  className = "",
}: TagProps) {
  return multiple ? (
    <ToggleGroup
      type="multiple"
      value={value}
      onValueChange={(val: string[] | undefined) => {
        onChange(val ?? []);
      }}
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {items.map((item) => (
        <ToggleGroupItem
          key={item}
          value={item}
          className="
            inline-flex
            items-center
            justify-center
            px-3 py-1
            h-7
            !rounded-full
            border border-[#C7C7CC]
            text-sm text-[#333333]
            whitespace-nowrap
            w-auto min-w-0 flex-none
            data-[state=on]:border-[#FF9B17]
            data-[state=on]:bg-[#FF9B17]/20
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
      value={value[0] ?? ""}
      onValueChange={(val: string | undefined) => {
        onChange(val ? [val] : []);
      }}
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {items.map((item) => (
        <ToggleGroupItem
        key={item}
        value={item}
        className="
          inline-flex
          items-center
          justify-center
          px-3 py-1
          h-7
          rounded-full
          border border-[#C7B39C]
          text-sm text-[#595959]
          whitespace-nowrap
          w-auto min-w-0 flex-none
          data-[state=on]:bg-[#FF9B17]
          data-[state=on]:text-white
      "
      >
          {item}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

