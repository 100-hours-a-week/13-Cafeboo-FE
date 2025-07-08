import MemberImage from '@/components/common/MemberImage';

interface ProfileCardProps {
  nickname: string;
  profileImageUrl: string;
  onDeleteAccountClick: () => void;
  dailyCaffeineLimitMg: number;
  coffeeBean: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  nickname,
  profileImageUrl,
  onDeleteAccountClick,
  dailyCaffeineLimitMg,
  coffeeBean,
}) => {
  return (
    <div className="relative rounded-xl max-w-md mx-auto">
      {/* 프로필 사진과 닉네임+회원탈퇴 영역 */}
      <div className="flex items-center justify-start gap-3">
        {/* 왼쪽: 프로필 사진 */}
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
          <MemberImage
            url={profileImageUrl}
            alt="프로필"
            className="w-full h-full rounded-full bg-gray-100"
          />
        </div>

        {/* 오른쪽: 닉네임 + 회원탈퇴 */}
        <div className="flex flex-col justify-center max-w-xs">
          <div className="flex items-baseline space-x-0.5 mb-0.5">
            <span className="text-lg font-semibold">{nickname}</span>
            <span className="text-lg">님</span>
          </div>
          <button
            type="button"
            onClick={onDeleteAccountClick}
            className="flex items-center text-xs px-1 w-max text-gray-400 underline cursor-pointer"
          >
            회원탈퇴
          </button>
        </div>
      </div>

      {/* 권장량, 커피콩 박스 */}
      <div className="flex max-w-md mx-auto rounded-lg mt-6 py-3 px-4 bg-gray-50 text-center text-sm">
        {/* 카페인 권장량 */}
        <div className="flex-1 text-left">
          <p className="text-xs text-gray-500 mb-0.5">일일 카페인 권장량</p>
          <p className="font-semibold text-gray-900">{dailyCaffeineLimitMg} mg</p>
        </div>

        {/* 세로 구분선 */}
        <div className="w-px bg-gray-300 mx-4" />

        {/* 커피콩 개수 */}
        <div className="flex-1 text-left">
          <p className="text-xs text-gray-500 mb-0.5">커피콩 개수</p>
          <p className="font-semibold text-gray-900">{coffeeBean}개</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
