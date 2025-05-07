import { useState } from 'react'
import Header from '@/components/common/Header'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const DiaryEdit: React.FC = () => {
  const navigate = useNavigate()

  const [drink, setDrink] = useState('아메리카노')
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [amount, setAmount] = useState<string>('')

  const handleUpdate = () => {
    // TODO: 수정 API 호출
    // 예: updateCaffeineRecord({ drink, date, time, amount })
    navigate(-1)
  }

  const handleDelete = () => {
    // TODO: 삭제 API 호출
    // 예: deleteCaffeineRecord(recordId)
    navigate(-1)
  }

  return (
    <div className="min-h-screen">
      <Header mode="title" title="카페인 기록 수정" onBackClick={() => navigate(-1)} />
      <main className="px-4 pt-16 space-y-6">
        {/* 음료 선택 */}
        <div className="space-y-1">
          <Label htmlFor="drink">음료</Label>
          <Select value={drink} onValueChange={setDrink}>
            <SelectTrigger id="drink" className="w-full">
              <SelectValue placeholder="음료 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="아메리카노">아메리카노</SelectItem>
              <SelectItem value="카페라떼">카페라떼</SelectItem>
              <SelectItem value="아이스티">아이스티</SelectItem>
              <SelectItem value="녹차">녹차</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 날짜 선택 */}
        <div className="space-y-1">
          <Label htmlFor="date">날짜</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full"
          />
        </div>

        {/* 시간 선택 */}
        <div className="space-y-1">
          <Label htmlFor="time">시간</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full"
          />
        </div>

        {/* 카페인 함유량 */}
        <div className="space-y-1">
          <Label htmlFor="amount">카페인 함유량 (mg)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="예: 150"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full"
          />
        </div>

        {/* 수정 버튼 */}
        <Button className="w-full" onClick={handleUpdate}>
          수정하기
        </Button>

        {/* 삭제 링크 */}
        <button
          className="w-full text-center text-sm text-red-600 mt-2"
          onClick={handleDelete}
        >
          삭제하기
        </button>
      </main>
    </div>
  )
}

export default DiaryEdit
