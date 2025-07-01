import { useRef, useState, useEffect } from 'react';
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
import HorizontalScroller from '@/components/common/HorizontalScroller';

export interface DailyCaffeineRemainProps {
  caffeineByHour: Array<{ time: string; caffeineMg: number }>;
  sleepSensitiveThreshold: number;
}

export default function DailyCaffeineRemain({
  caffeineByHour,
  sleepSensitiveThreshold,
}: DailyCaffeineRemainProps) {
  const data = caffeineByHour;

  // 현재 시간 → 가장 가까운 정각 계산
  const now = new Date();
  const nowHour = now.getHours();
  const nowMinute = now.getMinutes();
  const roundedHour = nowMinute >= 30 ? nowHour + 1 : nowHour;
  const nowTimeStr = `${(roundedHour % 24).toString().padStart(2, '0')}:00`;

  // 중복 시각 있을 경우 중심에 가까운 인덱스를 찾기
  const centerIndex = Math.floor(data.length / 2);
  const allNowIndices = data
    .map((d, i) => (d.time === nowTimeStr ? i : -1))
    .filter((i) => i !== -1);

  const nowIndex =
    allNowIndices.length > 0
      ? allNowIndices.reduce((closest, idx) => {
          return Math.abs(idx - centerIndex) < Math.abs(closest - centerIndex)
            ? idx
            : closest;
        }, allNowIndices[0])
      : -1;

  const scrollIndex = Math.max(0, nowIndex - 1);

  const containerRef = useRef<HTMLDivElement>(null);
  const [nowX, setNowX] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const BAR_GAP = 2;
  const base = (windowWidth - 80) / data.length;
  const BAR_WIDTH = Math.max(16, Math.min(16, base * 0.6));
  const minWidth = (BAR_WIDTH + BAR_GAP) * data.length + BAR_WIDTH;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current && scrollIndex >= 0) {
        const scrollX = scrollIndex * (BAR_WIDTH + BAR_GAP);
        containerRef.current.scrollTo({ left: scrollX, behavior: 'smooth' });
      }

      if (nowIndex >= 0) {
        const x = nowIndex * (BAR_WIDTH + BAR_GAP);
        setNowX(x);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [data]);

  const tickFormatter = (val: string) => {
    const hour = Number(val.split(':')[0]);
    if (hour % 3 !== 0) return '';
    const ampm = hour < 12 ? 'AM' : 'PM';
    const disp = hour % 12 === 0 ? 12 : hour % 12;
    return `${disp}${ampm}`;
  };

  const maxRemaining = Math.max(
    sleepSensitiveThreshold,
    ...caffeineByHour.map((d) => d.caffeineMg)
  );
  const tickCount = Math.ceil(maxRemaining / 100) + 1;
  const ticks = Array.from({ length: tickCount }, (_, i) => i * 100);

  return (
    <div className="flex">
      {/* Y축 */}
      <div className="w-10">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 0, bottom: 40, left: 0 }}
          >
            <YAxis
              type="number"
              domain={[0, maxRemaining]}
              ticks={ticks}
              tickFormatter={(val) => (val === 0 ? '' : String(val))}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#595959' }}
              width={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 스크롤 차트 */}
      <div className="flex-1 overflow-x-auto scrollbar-hide">
        <HorizontalScroller ref={containerRef}>
          <div
            className="h-[180px] relative"
            style={{ minWidth: `${minWidth}px` }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
                barCategoryGap={`${(BAR_GAP / BAR_WIDTH) * 100}%`}
                syncId="caffeineSync"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#C7C7CC" vertical={false} />
                <YAxis hide domain={[0, maxRemaining]} ticks={ticks} />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  tickFormatter={tickFormatter}
                  tick={{ fontSize: 10, fill: '#595959' }}
                  padding={{ left: BAR_WIDTH, right: BAR_WIDTH / 2 }}
                />
                <Bar dataKey="caffeineMg" barSize={BAR_WIDTH}>
                  {data.map((entry, idx) => {
                    const ratio = entry.caffeineMg / maxRemaining;
                    const lightness = 80 - ratio * 30;
                    const fillColor = `hsl(38, 100%, ${lightness}%)`;
                    return <Cell key={idx} fill={fillColor} />;
                  })}
                </Bar>
                <ReferenceLine
                  y={sleepSensitiveThreshold}
                  stroke="#543122"
                  strokeDasharray="3 3"
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Now 마커 */}
            {nowX !== null && (
              <div
                className="absolute bottom-[-5px] translate-x-[-50%] translate-y-[-24px] bg-gray-200 rounded-full px-2 py-[1px] text-[10px] font-semibold text-[#595959] shadow-[0_0_0_2px_rgba(255,255,255,0.7)] z-10 transform"
                style={{ left: `${nowX + BAR_WIDTH / 2}px` }}
              >
                Now
              </div>
            )}
          </div>
        </HorizontalScroller>
      </div>
    </div>
  );
}








