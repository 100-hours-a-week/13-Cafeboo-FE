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

export interface DailyCaffeineRemainProps {
  caffeineByHour: Array<{ time: string; caffeineMg: number }>;
  sleepSensitiveThreshold: number;
}

export default function DailyCaffeineRemain({
  caffeineByHour,
  sleepSensitiveThreshold,
}: DailyCaffeineRemainProps) {
  const data = caffeineByHour;

  const nowHour = new Date().getHours();
  const nowIndex = data.findIndex(
    (d) => Number(d.time.split(':')[0]) === nowHour
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [nowX, setNowX] = useState(0);
  const updateNowX = () => {
    const xAxisMap = chartRef.current?.state?.xAxisMap;
    const scale = xAxisMap && xAxisMap[Object.keys(xAxisMap)[0]]?.scale;
    if (scale && typeof scale === 'function' && nowIndex >= 0) {
      const timeValue = data[nowIndex]?.time;
      const x = scale(timeValue);
      if (typeof x === 'number') {
        setNowX(x);
      }
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 초기 로드 시 화면 크기 확인
    handleResize();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateNowX();
    }, 100);

    return () => clearTimeout(timeout);
  }, [nowIndex, data]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const base = (windowWidth - 80) / data.length;
  const BAR_WIDTH = Math.max(8, Math.min(16, base * 0.6));
  const minWidth = 18 * data.length + 18;

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
      {/* 1) 고정된 Y축 영역 */}
      <div className="w-10">
        <ResponsiveContainer width="100%" height="100%">
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

      {/* 2) 스크롤 가능한 바 차트 + X축 영역 */}
      <div   className={`flex-1 overflow-x-auto ${isMobile ? 'scrollbar-hide' : ''}`}>
        <div
          className="h-[180px] w-full relative"
          style={{ minWidth: `${minWidth}px` }}
          ref={containerRef}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              ref={chartRef}
              data={data}
              margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#C7C7CC"
                vertical={false}
              />
              <YAxis
                hide
                type="number"
                domain={[0, maxRemaining]}
                ticks={ticks}
                tickFormatter={(val) => (val === 0 ? '' : String(val))}
                minTickGap={0}
                interval={0}
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                interval={0}
                tickFormatter={tickFormatter}
                tick={{ fontSize: 10, fill: '#595959' }}
                padding={{ left: BAR_WIDTH, right: BAR_WIDTH / 2 }}
              />

              <Bar dataKey="caffeineMg" barSize={BAR_WIDTH} activeBar={false}>
                {data.map((_, idx) => (
                  <Cell key={idx} fill={'#FE9400'} fillOpacity={0.8} />
                ))}
              </Bar>
              <ReferenceLine
                y={sleepSensitiveThreshold}
                stroke="#543122"
                strokeDasharray="4 4"
              ></ReferenceLine>
            </BarChart>
          </ResponsiveContainer>
          {Number.isFinite(nowX) && nowX > 0 && (
            <div
              className="
                  absolute 
                  bottom-[-5px] 
                  translate-x-[-50%] translate-y-[-24px] 
                  bg-gray-200 
                  rounded-full 
                  px-2 py-[1px]
                  text-[10px] 
                  font-semibold 
                  text-[#595959]
                  shadow-[0_0_0_2px_rgba(255,255,255,0.7)]
                  z-10
                  transform
                "
              style={{ left: `${nowX + BAR_WIDTH / 2}px` }}
            >
              Now
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
