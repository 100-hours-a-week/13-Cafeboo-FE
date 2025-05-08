import { PeriodType } from './DropdownSelector';

interface ReportMessageProps {
  statusMessage: string; // 리포트에 대한 상태 메시지
  period: PeriodType; // 선택된 리포트 기간 종류
}

const ReportMessage: React.FC<ReportMessageProps> = ({
  statusMessage,
  period,
}) => {
  return (
    <div className="rounded-lg shadow-sm border border-gray-200 p-4">
      <p className="text-[#333333]">{statusMessage}</p>
    </div>
  );
};

export default ReportMessage;
