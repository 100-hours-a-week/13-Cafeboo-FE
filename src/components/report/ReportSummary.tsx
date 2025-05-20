import { Coffee } from 'lucide-react';
import { PeriodType } from './DropdownSelector';

interface ReportSummaryProps {
  period: PeriodType;
  averageCaffeine: number;
  dailyLimit: number;
  overLimitDays?: number;
}

const avgLabelMap: Record<PeriodType, string> = {
  weekly: '하루 평균',
  monthly: '한 주 평균',
  yearly: '한 달 평균',
};

const ReportSummary: React.FC<ReportSummaryProps> = ({
  period,
  averageCaffeine,
  dailyLimit,
  overLimitDays,
}) => {
  // 카페인 초과일 표시는 주간 리포트일 때만
  const showOverLimit = period === 'weekly';
  const challengeDays = showOverLimit ? overLimitDays || 0 : 0;

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 mb-4">
      {/* 평균 섭취 */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex justify-between items-center">
            <span className="text-md mr-2">🌱</span>
            <span className="text-[#333333] font-medium">
              {avgLabelMap[period]}
            </span>
          </div>
        <span className="text-[#333333] font-medium">{averageCaffeine.toFixed(1)} mg</span>
      </div>

      {/* 카페인 초과일 (주간 리포트일 때만) */}
      {showOverLimit && (
        <div className="p-4 flex justify-between items-center">
          <div className="flex justify-between items-center">
            <span className="text-lmd mr-2">🔥</span>
            <span className="text-[#333333] font-medium">카페인 초과일</span>
          </div>
          <span className="text-[#333333] font-medium">{challengeDays}일</span>
        </div>
      )}
    </div>
  );
};

export default ReportSummary;
