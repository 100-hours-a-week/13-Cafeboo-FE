import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import { BarChart2, Plus } from 'lucide-react';
import CaffeineCalendar from '@/components/diary/CaffeineCalendar';
import CaffeineList from '@/components/diary/CaffeineList';
import { useNavigate } from 'react-router-dom';

interface CaffeineRecord {
  intakeId: string;
  drinkName: string;
  drinkCount: number;
  caffeineAmount: number;
  intakeTime: string;
}

const caffeineData = {
  '2025-03-02': 450,
  '2025-03-03': 220,
  '2025-03-05': 90,
  '2025-03-09': 150,
};

const dailyRecordsData: { [date: string]: CaffeineRecord[] } = {
  '2025-03-09': [
    {
      intakeId: '1',
      drinkName: '아메리카노',
      drinkCount: 1,
      caffeineAmount: 150,
      intakeTime: '12:15',
    },
    {
      intakeId: '2',
      drinkName: '아메리카노',
      drinkCount: 1,
      caffeineAmount: 150,
      intakeTime: '12:15',
    },
  ],
};

// 날짜 포맷 유틸
const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const DiaryPage = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [records, setRecords] = useState<CaffeineRecord[]>([]);
  const navigate = useNavigate();

  const fetchDailyRecords = async (date: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const data = dailyRecordsData[date] || [];
        setRecords(data);
        resolve();
      }, 300);
    });
  };

  useEffect(() => {
    fetchDailyRecords(selectedDate);
  }, []);

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    await fetchDailyRecords(date);
  };

  const handleMonthChange = (newYear: number, newMonth: number) => {
    const newDate = `${newYear}-${String(newMonth).padStart(2, '0')}-01`;
    setYear(newYear);
    setMonth(newMonth);
    setSelectedDate(newDate);
    fetchDailyRecords(newDate);
  };

  const handleEdit = (intakeId: string) => {
    navigate(`/main/diary/edit/${intakeId}`);
  };

  return (
    <div className="dark:bg-[#121212] min-h-screen">
      <Header mode="logo" />
      <main className="pt-16 space-y-4">
        <CaffeineCalendar
          year={year}
          month={month}
          selectedDate={selectedDate}
          caffeineData={caffeineData}
          onDateSelect={handleDateSelect}
          onMonthChange={handleMonthChange}
        />

        <h2 className="mt-6 mb-3 text-lg text-[#000000] font-semibold">
          {new Date(selectedDate).getMonth() + 1}월 {new Date(selectedDate).getDate()}일 카페인 기록
        </h2>

        <CaffeineList records={records} onEdit={handleEdit} />

        <button
          className="fixed bottom-18 right-6 w-12 h-12 rounded-full bg-[#FF9B17] text-white flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)]"
          onClick={() => navigate('/main/report')}
        >
          <BarChart2 size={24} />
        </button>

        <button
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#56433C] text-white flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)]"
          onClick={() => navigate('/home/add')}
        >
          <Plus size={24} />
        </button>
      </main>
    </div>
  );
};

export default DiaryPage;

