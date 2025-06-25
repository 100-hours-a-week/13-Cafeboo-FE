import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DailyCaffeineProps {
  nickname: string;
  dailyCaffeineLimit: number;
  dailyCaffeineIntakeMg: number;
  dailyCaffeineIntakeRate: number;
  intakeGuide: string;
}

export default function DailyCaffeine({
  nickname,
  dailyCaffeineLimit,
  dailyCaffeineIntakeMg,
  dailyCaffeineIntakeRate,
  intakeGuide,
}: DailyCaffeineProps) {
  
  const consumed = dailyCaffeineIntakeMg;

  // 초록 -> 노랑 -> 빨강으로 섭취량 그라데이션션
  const SCALE = [
    '#22C55E', // 0% → green
    '#84CC16', // 25% → lime
    '#FFC107', // 50% → amber
    '#FF5722', // 75% → deep orange
    '#F44336', // 100% → red
  ];

  function getConsumedColor(ratePercent: number) {
    const idx = Math.min(
      SCALE.length - 1,
      Math.floor((ratePercent / 100) * (SCALE.length - 1))
    );
    return SCALE[idx];
  }

  const percent = Math.min(dailyCaffeineIntakeRate, 100);
  const consumedColor  = getConsumedColor(percent);
  const remainingColor = '#E5E5E5';
  const consumedAngle = (percent / 100) * 360;

  return (
    <div className="flex items-center relative">
      <div className="w-2/5 h-40 relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={[{ value: 100 }]}
              dataKey="value"
              innerRadius="70%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill={remainingColor} />
            </Pie>
            <Pie
              data={[{ value: consumed }]}
              dataKey="value"
              innerRadius="70%"
              outerRadius="90%"
              startAngle={91.5} // UX 개선을 위한 시각적 효과 처리
              endAngle={90 - consumedAngle}
              cornerRadius={10}
            >
              <Cell fill={consumedColor} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-bold">
            {consumed} mg
          </span>
          <span className="text-sm text-[#595959]">
            / {dailyCaffeineLimit} mg
          </span>
        </div>
      </div>

      <div className="w-3/5 pl-4 pr-2">
        <p className="text-base">
          <span className="font-semibold">{nickname}</span>님,
          <br/>
          현재 권장량의{' '}
          <span className="font-semibold" style={{ color: consumedColor }}>
            {dailyCaffeineIntakeRate}%
          </span>
          를 <br />
          섭취 중이에요.
        </p>
        <Popover>
        <PopoverTrigger asChild>
          <p className="mt-2 text-sm text-[#595959] overflow-hidden line-clamp-2 cursor-pointer">
            {intakeGuide}
          </p>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <p className="text-sm text-[#595959]">{intakeGuide}</p>
        </PopoverContent>
      </Popover>
      </div>
    </div>
  );
}
