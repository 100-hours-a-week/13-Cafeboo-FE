import SectionCard from '@/components/common/SectionCard';

interface DrinkSelectSectionProps {
  drinkName: string;
  onOpenSelect: () => void;
}

export default function DrinkSelectSection({
  drinkName,
  onOpenSelect,
}: DrinkSelectSectionProps) {
  return (
    <SectionCard className="flex items-center justify-between">
      <span className="font-medium">음료</span>
      <button
        className="px-4 py-1 bg-gray-200 rounded cursor-pointer"
        onClick={onOpenSelect}
      >
        {drinkName}
      </button>
    </SectionCard>
  );
}
