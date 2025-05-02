import { useOnboardingStore } from '@/stores/onboardingStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const Step3 = () => {
  const { sleepInfo, updateSleep } = useOnboardingStore()

  return (
    <div className="space-y-6 py-4">
      {/* 자주 마시는 시간대 */}
      <div>
        <Label className="text-base text-[#56433C] mb-2 block font-semibold">가장 자주 마시는 시간대</Label>
        <Input
          type="time"
          step={60}                           
          value={sleepInfo.caffeineIntakeTime ?? '12:00'}
          onChange={(e) =>
            updateSleep({ caffeineIntakeTime: e.target.value })
          }
          className="
            w-1/2 rounded-lg border border-[#C7B39C] cursor-pointer
            px-4 py-2 text-[#595959]
            focus:outline-none focus:border-[#8C593D]
          "
        />
      </div>

      {/* 수면 시간 */}
      <div>
        <Label className="text-base text-[#56433C] mb-2 block font-semibold">수면 시간</Label>
        <div className="flex items-center space-x-2">
          <Input
            type="time"
            step={60}
            placeholder="시작 시간 선택"
            value={sleepInfo.sleepStartTime ?? '12:00'}
            onChange={(e) => updateSleep({ sleepStartTime: e.target.value })}
            className="w-1/2 cursor-pointer border-[#C7B39C] px-4"
          />
          <span className="text-[#595959]">~</span>
          <Input
            type="time"
            step={60}
            placeholder="종료 시간 선택"
            value={sleepInfo.sleepEndTime ?? '12:00'}
            onChange={(e) => updateSleep({ sleepEndTime: e.target.value })}
            className="w-1/2 cursor-pointer border-[#C7B39C] px-4"
          />
        </div>
      </div>
    </div>
  )
}

export default Step3
