import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportPageUI from '@/pages/report/ReportPageUI';
import { useWeeklyReport } from '@/api/report/weeklyReportApi';
import { useMonthlyReport } from '@/api/report/monthlyReportApi';
import { useYearlyReport } from '@/api/report/yearlyReportApi';
import { recordCaffeineIntake } from '@/api/caffeine/caffeineApi';
import type { CaffeineIntakeRequestDTO } from '@/api/caffeine/caffeine.dto';
import { getWeekOfMonth } from 'date-fns';

export default function ReportContainer() {
  const navigate = useNavigate();

  const today = new Date();
  const defaultYear = String(today.getFullYear());
  const defaultMonth = String(today.getMonth() + 1);
  const defaultWeek = `${getWeekOfMonth(today)}`;

  const [periodType, setPeriodType] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedWeek, setSelectedWeek] = useState(defaultWeek);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const {
    data: weeklyData,
    isLoading: loadingWeekly,
    isError: errorWeekly,
    error: weeklyError,
    refetch: refetchWeekly,
  } = useWeeklyReport(selectedYear, selectedMonth, selectedWeek);

  const {
    data: monthlyData,
    isLoading: loadingMonthly,
    isError: errorMonthly,
    error: monthlyError,
    refetch: refetchMonthly,
  } = useMonthlyReport(selectedYear, selectedMonth);

  const {
    data: yearlyData,
    isLoading: loadingYearly,
    isError: errorYearly,
    error: yearlyError,
    refetch: refetchYearly,
  } = useYearlyReport(selectedYear);

  useEffect(() => {
    if (periodType === 'weekly') refetchWeekly();
    else if (periodType === 'monthly') refetchMonthly();
    else refetchYearly();
  }, [periodType, selectedYear, selectedMonth, selectedWeek]);

  // 공통 데이터 구조 매핑
  const reportData = periodType === 'weekly' ? {
    dailyIntakeTotals: weeklyData?.dailyIntakeTotals,
    dailyCaffeineLimit: weeklyData?.dailyCaffeineLimit,
    caffeineAvg: weeklyData?.dailyCaffeineAvg,
    overLimitDays: weeklyData?.overLimitDays,
    aiMessage: weeklyData?.aiMessage,
    weeklyIntakeTotals: monthlyData?.weeklyIntakeTotals,
  } : periodType === 'monthly' ? {
    caffeineAvg: monthlyData?.weeklyCaffeineAvg,
    weeklyIntakeTotals: monthlyData?.weeklyIntakeTotals,
  } : {
    caffeineAvg: yearlyData?.monthlyCaffeineAvg,
    monthlyIntakeTotals: yearlyData?.monthlyIntakeTotals,
  };

  const isLoading = periodType === 'weekly' ? loadingWeekly : periodType === 'monthly' ? loadingMonthly : loadingYearly;
  const isError = periodType === 'weekly' ? errorWeekly : periodType === 'monthly' ? errorMonthly : errorYearly;
  const errorMessage = periodType === 'weekly' ? weeklyError?.message : periodType === 'monthly' ? monthlyError?.message : yearlyError?.message;

  const handlePeriodChange = (period: 'weekly' | 'monthly' | 'yearly') => setPeriodType(period);

  const handleSubmitRecord = async (record: CaffeineIntakeRequestDTO) => {
    try {
      await recordCaffeineIntake(record);
      refetchWeekly();
      refetchMonthly();
      refetchYearly();
    } catch (error: any) {
      setAlertMessage(error.message || '카페인 등록에 실패했습니다.');
      setIsAlertOpen(true);
    }
  };

  const handlers = {
    onPeriodChange: handlePeriodChange,
    onSubmitRecord: handleSubmitRecord,
  };

  const status = {
    isLoading,
    isError,
    errorMessage,
  };

  const controls = {
    isSheetOpen,
    setIsSheetOpen,
    isAlertOpen,
    setIsAlertOpen,
    alertMessage,
  };

  const navigation = {
    onMainClick: () => navigate('/main/diary'),
  };

  return (
    <ReportPageUI
      periodType={periodType}
      selectedYear={selectedYear}
      selectedMonth={selectedMonth}
      selectedWeek={selectedWeek}
      setSelectedYear={setSelectedYear}
      setSelectedMonth={setSelectedMonth}
      setSelectedWeek={setSelectedWeek}
      reportData={reportData}
      status={status}
      handlers={handlers}
      controls={controls}
      navigation={navigation}
    />
  );
}
