import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export interface DailyCaffeineProps {
  nickname: string;
  dailyCaffeineLimit: number;
  dailyCaffeineIntakeMg: number;
  intakeGuide: string;
}

export default function DailyCaffeine({
  nickname,
  dailyCaffeineLimit,
  dailyCaffeineIntakeMg,
  intakeGuide,
}: DailyCaffeineProps) {
  const consumed = dailyCaffeineIntakeMg;
  const ratio = Math.min(consumed / dailyCaffeineLimit, 1);

  // 초록 -> 노랑 -> 빨강으로 섭취량 그라데이션션
  const SCALE = [
    '#22C55E', // 0% → green
    '#84CC16', // 25% → lime
    '#FFC107', // 50% → amber
    '#FF5722', // 75% → deep orange
    '#F44336', // 100% → red
  ];

  function getConsumedColor(ratio: number) {
    // ratio: 0~1 사이
    const idx = Math.min(
      SCALE.length - 1,
      Math.floor(ratio * (SCALE.length - 1))
    );
    return SCALE[idx];
  }

  const consumedColor = getConsumedColor(ratio);
  const remainingColor = '#E5E5E5';
  const consumedAngle = ratio * 360;

  return (
    <div className="flex items-center bg-white rounded-lg p-2 relative">
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
          <span className="text-lg font-bold text-[#333333]">
            {consumed} mg
          </span>
          <span className="text-sm text-[#595959]">
            / {dailyCaffeineLimit} mg
          </span>
        </div>
      </div>

      <div className="w-3/5 p-4">
        <p className="text-base text-[#333333]">
          <span className="font-semibold">{nickname}</span>님,
          <br></br>
          현재 권장량의{' '}
          <span className="font-semibold" style={{ color: consumedColor }}>
            {Math.round(ratio * 100)}%
          </span>
          를 <br></br>섭취 중이에요.
        </p>
        <p className="mt-2 text-sm text-[#595959] overflow-hidden line-clamp-2">{intakeGuide}</p>
      </div>
    </div>
  );
}
