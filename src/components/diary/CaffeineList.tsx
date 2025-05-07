import { ChevronRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '@/components/common/EmptyState';

interface CaffeineListProps {
  records: Array<CaffeineRecord>;
  onEdit: (intakeId: string) => void;
}

interface CaffeineRecord {
  intakeId: string;
  drinkName: string;
  drinkCount: number;
  caffeineAmount: number;
  intakeTime: string;
}

const CaffeineList: React.FC<CaffeineListProps> = ({ records, onEdit }) => {
  const navigate = useNavigate();

  if (records.length === 0) {
    return (
      <EmptyState
        title="기록이 없습니다"
        description={
            <>
              <span>아직 등록된 카페인 섭취 기록이 없어요.</span>
              <span>아래 버튼을 눌러 추가해보세요!</span>
            </>
          }
        icon={<FileText size={32} />}
      />
    );
  }

  const CoffeeBeanIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28">
    <circle cx="14" cy="14" r="14" fill="#FE9400" fillOpacity={0.2} />
    <g transform="rotate(40, 14, 14)">
        <ellipse cx="14" cy="14" rx="5" ry="6.5" fill="#8C593D" />
        <path d="M14 8 C13 11, 13 17, 14 20 C15 17, 15 11, 14 7" fill="#5B3924" />
    </g>
    </svg>
  );

  const formatTimeWithMeridiem = (time: string) => {
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const meridiem = hour < 12 ? '오전' : '오후';
  
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
  
    return `${meridiem} ${hour}:${minute}`;
  };

  return (
    <div className="flex flex-col gap-2">
      {records.map((record) => (
        <div
          key={record.intakeId}
          className="bg-white rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)] px-4 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
          <CoffeeBeanIcon />
            <div className="flex flex-col gap-1 ml-1">
              <span className="text-[#333333] font-medium">
                {record.drinkName} {record.drinkCount}잔
              </span>
              <span className="text-[#595959] text-xs">
                {formatTimeWithMeridiem(record.intakeTime)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#333333] font-medium">{record.caffeineAmount} mg</span>
            <ChevronRight
              size={18}
              className="text-[#333333] cursor-pointer"
              onClick={() => onEdit(record.intakeId)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CaffeineList;
