import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';
import { PeriodType } from './DropdownSelector';

interface ReportApiData {
  dailyIntakeTotals?: { date: string; caffeineMg: number }[];
  dailyCaffeineLimit?: number;
  weeklyIntakeTotals?: { isoWeek: string; totalCaffeineMg: number }[];
  monthlyIntakeTotals?: { month: number; totalCaffeineMg: number }[];
}

interface ReportChartProps {
  period: PeriodType;
  data: ReportApiData;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export const ReportChart: React.FC<ReportChartProps> = ({ period, data }) => {
  const hasData =
    period === 'weekly'
      ? !!data.dailyIntakeTotals?.length
      : period === 'monthly'
        ? !!data.weeklyIntakeTotals?.length
        : !!data.monthlyIntakeTotals?.length;

  if (!hasData) {
    return (
      <div className="w-full bg-white rounded-xl p-4 shadow-sm mb-4">
        <div className="flex justify-center items-center h-40 text-gray-400">
          데이터가 없습니다
        </div>
      </div>
    );
  }

  const chartData = useMemo(() => {
    switch (period) {
      case 'weekly': {
        const arr = data.dailyIntakeTotals || [];
        // 날짜 오름차순
        arr.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        return arr.map((pt) => ({
          label: WEEKDAYS[new Date(pt.date).getDay()],
          value: pt.caffeineMg,
        }));
      }

      case 'monthly': {
        const arr = data.weeklyIntakeTotals || [];
        // 1주 전부터 시작하는 배열 생성 후 역순으로 (오른쪽이 1주 전)
        const mapped = arr.map((pt, i) => ({
          label: `${i + 1}주 전`,
          value: pt.totalCaffeineMg,
        }));
        return mapped.reverse();
      }

      case 'yearly': {
        const arr = data.monthlyIntakeTotals || [];
        // 월 기준 정렬
        arr.sort((a, b) => a.month - b.month);
        return arr.map((pt) => ({
          label: MONTHS[pt.month - 1],
          value: pt.totalCaffeineMg,
        }));
      }

      default:
        return [];
    }
  }, [period, data]);

  const title =
    period === 'weekly'
      ? '주간 총 섭취량'
      : period === 'monthly'
        ? '월간 총 섭취량'
        : '연간 총 섭취량';

  const dailyLimit = data.dailyCaffeineLimit ?? 400;

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 mb-4 mx-auto py-4">
      <h3 className="text-[#000000] font-medium mb-4 text-center">
        {title} 그래프
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 40, left: 0, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            padding={{ left: 10, right: 10 }}
            tick={{ fill: '#333333', fontSize: 12 }}
            interval={0}
          />
          <YAxis tick={{ fill: '#333333', fontSize: 12 }} interval={0} />

          {/* 주간 리포트일 때만 일일 권장량 선 그리기 */}
          {period === 'weekly' && (
            <ReferenceLine
              y={dailyLimit}
              stroke="#ff4d4f"
              strokeDasharray="3 3"
            />
          )}

          <Bar dataKey="value">
            {chartData.map((entry, idx) => (
              <Cell
                key={idx}
                fill={
                  period === 'weekly' && entry.value > dailyLimit
                    ? '#ff4d4f'
                    : '#FE9400'
                }
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {period === 'weekly' && (
        <div className="flex items-center ml-10 text-xs text-[#333333]">
          <span className="inline-block w-4 border-[#ff4d4f] mr-2 border-b-2 border-dashed" />
          권장량: {dailyLimit} mg
        </div>
      )}
    </div>
  );
};

export default ReportChart;
