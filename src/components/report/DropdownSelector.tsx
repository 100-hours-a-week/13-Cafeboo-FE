import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export type PeriodType = 'weekly' | 'monthly' | 'yearly';

interface DropdownSelectorProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

const periodLabels: Record<PeriodType, string> = {
  weekly: '주별',
  monthly: '월별',
  yearly: '연도별',
};

const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="
            flex items-center justify-between
            w-28 px-4 py-2
            bg-white border border-[#dadcdf] rounded-lg
            text-[#333333] font-medium
            hover:bg-gray-50 focus:outline-none
          "
        >
          {periodLabels[selectedPeriod]}
          <ChevronDown size={16} className="ml-2" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-24">
        {(Object.entries(periodLabels) as [PeriodType, string][]).map(
          ([period, label]) => (
            <DropdownMenuItem
              key={period}
              onSelect={() => onPeriodChange(period)}
              className={
                selectedPeriod === period
                  ? 'bg-gray-100 text-[#333333] font-medium'
                  : 'text-[#333333]'
              }
            >
              {label}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownSelector;
