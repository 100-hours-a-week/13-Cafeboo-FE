import { ChevronRight } from 'lucide-react';

interface ProfileCardProps {
  nickname: string;
  profileImageUrl: string;
  caffeineLimit: number;
  beanCount: number;
  challengeCount: number;
  onEditClick: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  nickname,
  profileImageUrl,
  caffeineLimit,
  beanCount,
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
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={`${nickname}의 프로필`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#FE9400] flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-white"
                >
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            )}
          </div>
          <div>
            <p className="text-lg font-medium text-[#000000]">{nickname}</p>
            <p className="text-sm text-[#595959]">내 정보 수정</p>
          </div>
        </div>
        <ChevronRight className="text-[#333333] cursor-pointer" onClick={onEditClick} size={20} />
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-200 mb-4 -mx-4"></div>

      {/* 통계 영역 */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2">
          <p className="text-base font-semibold text-[#333333] mb-1">
            {caffeineLimit} mg
          </p>
          <p className="text-xs text-[#595959]">일일 권장 섭취량</p>
        </div>

        <div className="p-2 border-x border-gray-200">
          <p className="text-base font-semibold text-[#333333] mb-1">
            {beanCount}개
          </p>
          <p className="text-xs text-[#595959]">커피콩 갯수</p>
        </div>

        <div className="p-2">
          <p className="text-base font-semibold text-[#333333] mb-1">
            {challengeCount}회
          </p>
          <p className="text-xs text-[#595959]">챌린지 참여 횟수</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
