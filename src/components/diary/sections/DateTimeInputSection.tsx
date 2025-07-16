import SectionCard from "@/components/common/SectionCard";

interface DateTimeInputSectionProps {
  date: string;
  time: string;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
}

export default function DateTimeInputSection({
  date,
  time,
  setDate,
  setTime,
}: DateTimeInputSectionProps) {
  return (
    <SectionCard className="!p-0">
        <div className="flex items-center justify-between border-b border-[#d0ced3] p-4">
            <span className="font-medium">날짜</span>
            <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="px-4 py-1 bg-gray-200 rounded text-center cursor-pointer"
            />
            </div>
            <div className="flex items-center justify-between p-4">
            <span className="font-medium">시간</span>
            <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="px-4 py-1 bg-gray-200 rounded text-center"
            />
        </div>
    </SectionCard>
  );
}
