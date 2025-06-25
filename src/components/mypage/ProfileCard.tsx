import { ChevronRight } from 'lucide-react';
import profile7 from '@/assets/profile7.png'

interface ProfileCardProps {
  nickname: string;
  dailyCaffeineLimitMg: number;
  coffeeBean: number;
  challengeCount: number;
  onEditClick: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  nickname,
  dailyCaffeineLimitMg,
  coffeeBean,
  challengeCount,
  onEditClick,
}) => {
  return (
    <div>
      {/* 프로필 영역 */}
      <div
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center">
          <div className="relative w-10 h-10 mr-3">
            <div className="absolute inset-0 rounded-full" />
            <img
                src={profile7}
                alt="프로필"
                className="w-full h-full rounded-full object-cover"
              />
          </div>
          <div>
            <p className="text-lg font-medium">{nickname}</p>
            <p className="text-sm text-[#595959]">내 정보 수정</p>
          </div>
        </div>
        <ChevronRight className="text-[#333333] cursor-pointer" onClick={onEditClick} size={20} />
      </div>

      {/* 구분선 */}
      <div className="border-t border-[#dadcdf] mb-4 -mx-4"></div>

      {/* 통계 영역 */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2">
          <p className="text-base font-semibold mb-1">
            {dailyCaffeineLimitMg} mg
          </p>
          <p className="text-xs text-[#595959]">일일 권장 섭취량</p>
        </div>

        <div className="p-2 border-x border-gray-200">
          <p className="text-base font-semibold mb-1">
            {coffeeBean}개
          </p>
          <p className="text-xs text-[#595959]">커피콩 갯수</p>
        </div>

        <div className="p-2">
          <p className="text-base font-semibold mb-1">
            {challengeCount}회
          </p>
          <p className="text-xs text-[#595959]">챌린지 참여 횟수</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
