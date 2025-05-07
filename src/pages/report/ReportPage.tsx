import { useState, useEffect } from "react"
import Header from "@/components/common/Header"
import { Calendar, Plus } from "lucide-react"
import DropdownSelector, { PeriodType } from "@/components/report/DropdownSelector"
import PeriodFilterSelector from "@/components/report/PeriodFilterSelector"
import ReportChart from "@/components/report/ReportChart"
import ReportSummary from "@/components/report/ReportSummary"
import ReportMessage from "@/components/report/ReportMessage"
import { useNavigate } from "react-router-dom"

// ReportChart 에서 받도록 정의한 타입
interface ReportApiData {
  dailyIntakeTotals?: { date: string; caffeineMg: number }[]
  dailyCaffeineLimit?: number
  weeklyIntakeTotals?: { isoWeek: string; totalCaffeineMg: number }[]
  monthlyIntakeTotals?: { month: number; totalCaffeineMg: number }[]

  dailyCaffeineAvg?: number
  overLimitDays?: number
  summaryMessage?: string
}

const ReportPage: React.FC = () => {
  const [periodType, setPeriodType] = useState<PeriodType>("weekly")
  const [selectedYear, setSelectedYear] = useState("2025년")
  const [selectedMonth, setSelectedMonth] = useState("1월")
  const [selectedWeek, setSelectedWeek] = useState("1주차")

  // 전체 API 응답 형태를 통째로 담을 state
  const [reportData, setReportData] = useState<ReportApiData>({})
  const navigate = useNavigate()

  const fetchReportData = (
    year: string,
    month?: string,
    week?: string
  ) => {
    // TODO: 실제 API 호출 → res.data 를 바로 setReportData(res.data)
    // 지금은 샘플 로직
    if (periodType === "weekly") {
        const daily = [
          { date: "2024-12-29", caffeineMg: 400 },
          { date: "2024-12-30", caffeineMg: 320 },
          { date: "2024-12-31", caffeineMg: 250 },
          { date: "2025-01-01", caffeineMg: 480 },
          { date: "2025-01-02", caffeineMg: 250 },
          { date: "2025-01-03", caffeineMg: 400 },
          { date: "2025-01-04", caffeineMg: 500 },
        ]
        const avg = daily.reduce((sum, d) => sum + d.caffeineMg, 0) / daily.length
        const over = daily.filter(d => d.caffeineMg > 400).length
        const message = `이번 주에는 총 ${daily.length}일 중 ${over}일간 권장량을 초과했어요.`
  
        setReportData({
          dailyIntakeTotals: daily,
          dailyCaffeineLimit: 400,
          dailyCaffeineAvg: Math.round(avg),
          overLimitDays: over,
          summaryMessage: message,
        })
      } else if (periodType === "monthly") {
        const weekly = [
          { isoWeek: "2025-W01", totalCaffeineMg: 1950 },
          { isoWeek: "2025-W02", totalCaffeineMg: 1800 },
          { isoWeek: "2025-W03", totalCaffeineMg: 1720 },
          { isoWeek: "2025-W04", totalCaffeineMg: 2100 },
          { isoWeek: "2025-W05", totalCaffeineMg: 1350 },
        ]
        const avg = Math.round(weekly.reduce((sum, w) => sum + w.totalCaffeineMg, 0) / weekly.length)
        const message = `지난 달 평균 주간 섭취량은 ${avg}mg입니다.`
  
        setReportData({
          weeklyIntakeTotals: weekly,
          dailyCaffeineAvg: avg,
          summaryMessage: message,
        })
      } else {
        const monthly = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, totalCaffeineMg: 7800 + i * 100 }))
        const avg = Math.round(monthly.reduce((sum, m) => sum + m.totalCaffeineMg, 0) / monthly.length)
        const message = `올해 평균 월간 섭취량은 ${avg}mg이에요.`
  
        setReportData({
          monthlyIntakeTotals: monthly,
          dailyCaffeineAvg: avg,
          summaryMessage: message,
        })
      }
  }

  useEffect(() => {
    fetchReportData(selectedYear, selectedMonth, selectedWeek)
  }, [periodType, selectedYear, selectedMonth, selectedWeek])

  const handlePeriodChange = (period: PeriodType) => {
    setPeriodType(period)
    // useEffect 에서 다시 fetchReportData 가 불립니다
  }

  const handleFilterChange = (
    year: string,
    month?: string,
    week?: string
  ) => {
    setSelectedYear(year)
    if (month) setSelectedMonth(month)
    if (week)  setSelectedWeek(week)
  }

  return (
    <div className="min-h-screen">
      <Header mode="logo" />
      <main className="w-full max-w-full mx-auto pt-16 space-y-4">
        <DropdownSelector
          selectedPeriod={periodType}
          onPeriodChange={handlePeriodChange}
        />

        <PeriodFilterSelector
          period={periodType}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedWeek={selectedWeek}
          onYearChange={setSelectedYear}
          onMonthChange={setSelectedMonth}
          onWeekChange={setSelectedWeek}
          onFilterChange={handleFilterChange}
        />

        {/* ReportChart 에는 data 프로퍼티로 전체 reportData 를 넘겨야 합니다 */}
        <ReportChart period={periodType} data={reportData} />

        <h2 className="mt-6 mb-3 text-md text-[#000000] font-semibold">
          리포트 요약
        </h2>
        <ReportSummary
          period={periodType}
          averageCaffeine={reportData.dailyCaffeineAvg ?? 0}
          dailyLimit={reportData.dailyCaffeineLimit ?? 400}
          overLimitDays={reportData.overLimitDays}
        />

        <h2 className="mt-6 mb-3 text-md text-[#000000] font-semibold">
          리포트 결과
        </h2>
        <ReportMessage
          period={periodType}
          statusMessage={reportData.summaryMessage ?? ''}
        />

        {/* 플로팅 버튼 */}
        <button
          className="fixed bottom-18 right-6 w-12 h-12 rounded-full bg-[#FE9400] text-white flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)]"
          onClick={() => navigate("/main/diary")}
        >
          <Calendar size={24} />
        </button>
        <button
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#745A50] text-white flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)]"
          onClick={() => navigate("/home/add")}
        >
          <Plus size={24} />
        </button>
      </main>
    </div>
  )
}

export default ReportPage
