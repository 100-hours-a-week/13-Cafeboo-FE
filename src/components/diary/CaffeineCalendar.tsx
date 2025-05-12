import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  year: number;
  month: number;
  selectedDate: string;
  caffeineData: { [date: string]: number };
  onDateSelect: (date: string) => Promise<void>;
  onMonthChange: (year: number, month: number) => void;
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CaffeineCalendar = ({
  year,
  month,
  selectedDate,
  caffeineData,
  onDateSelect,
  onMonthChange,
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(year, month - 1, 1)
  );
  const [internalSelectedDate, setInternalSelectedDate] = useState(
    new Date(selectedDate)
  );

  useEffect(() => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setInternalSelectedDate(new Date(selectedDate));
  }, [year, month, selectedDate]);

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonthDays = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDate = new Date(year, month, -i);
      prevMonthDays.unshift({
        date: prevDate,
        day: prevDate.getDate(),
        currentMonth: false,
      });
    }

    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      currentMonthDays.push({ date, day: i, currentMonth: true });
    }

    const nextMonthDays = [];
    const lastDay = new Date(year, month, daysInMonth).getDay();
    for (let i = 1; i < 7 - lastDay; i++) {
      const nextDate = new Date(year, month + 1, i);
      nextMonthDays.push({ date: nextDate, day: i, currentMonth: false });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const CoffeeBeanIcon = (amount: number) => {
    const color =
      amount <= 199 ? '#FFE3C8' : amount <= 400 ? '#FFC46E' : '#FFA634';

    return (
      <div
        className="absolute w-8 h-8 rounded-full"
        style={{ backgroundColor: color }}
      />
    );
  };

  const handleDateSelect = async (date: Date, isCurrentMonth: boolean) => {
    const newMonth = date.getMonth() + 1;
    const newYear = date.getFullYear();

    setInternalSelectedDate(date);

    if (!isCurrentMonth) {
      setCurrentMonth(new Date(newYear, date.getMonth(), 1));
      onMonthChange(newYear, newMonth);
    }

    await onDateSelect(formatDate(date));
  };

  const isSelectedDate = (date: Date) => {
    return (
      date.getDate() === internalSelectedDate.getDate() &&
      date.getMonth() === internalSelectedDate.getMonth() &&
      date.getFullYear() === internalSelectedDate.getFullYear()
    );
  };

  const days = getDaysInMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => {
            const newDate = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth() - 1,
              1
            );
            setCurrentMonth(newDate);
            onMonthChange(newDate.getFullYear(), newDate.getMonth() + 1);
          }}
        >
          <ChevronLeft size={20} className="text-[#595959]" />
        </button>
        <h3 className="text-lg font-medium text-[#333333]">
          {currentMonth.toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>
        <button
          onClick={() => {
            const newDate = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth() + 1,
              1
            );
            setCurrentMonth(newDate);
            onMonthChange(newDate.getFullYear(), newDate.getMonth() + 1);
          }}
        >
          <ChevronRight size={20} className="text-[#595959]" />
        </button>
      </div>

      <div className="mb-2">
        <div className="bg-[#FBF4E7] rounded-full grid grid-cols-7 gap-5 text-center text-base text-[#939393] py-1 px-3">
          {daysOfWeek.map((day, idx) => (
            <div key={idx}>{day}</div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dateStr = formatDate(day.date);
          const amount = caffeineData[dateStr] || 0;
          const isSelected = isSelectedDate(day.date);

          return (
            <button
              key={index}
              onClick={() => handleDateSelect(day.date, day.currentMonth)}
              className="aspect-square flex items-center justify-center relative"
            >
              {isSelected && (
                <div className="absolute w-10 h-10 rounded-lg bg-[#808080]/20" />
              )}

              {day.currentMonth && amount > 0 && CoffeeBeanIcon(amount)}

              <span
                className={`z-10 ${isSelected} ${
                  day.currentMonth && amount > 0
                    ? 'text-[#333333]'
                    : day.currentMonth
                      ? 'text-[#333333]'
                      : 'text-[#BFBFBF]'
                }`}
              >
                {day.day}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default CaffeineCalendar;
