import SectionCard from '@/components/common/SectionCard';

interface CaffeineAmountSectionProps {
  amount: number;
  onOpenDetail: () => void;
}

export default function CaffeineAmountSection({
  amount,
  onOpenDetail,
}: CaffeineAmountSectionProps) {
  return (
    <SectionCard className="flex items-center justify-between">
      <span className="font-medium">총 카페인량</span>
      <button
        className="px-4 py-1 bg-gray-200 rounded cursor-pointer"
        onClick={onOpenDetail}
      >
        {amount} mg
      </button>
    </SectionCard>
  );
}
