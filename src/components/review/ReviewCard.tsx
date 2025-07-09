import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CoffeeChatReviewSummary } from "@/api/coffeechat/coffeechat.dto";
import SectionCard from "@/components/common/SectionCard";
import HeartButton from "@/components/review/HeartButton";
import { useCoffeeChatMembers } from "@/api/coffeechat/coffeechatMemberApi";
import Icon from "@/assets/CoffeeChatIcon.png";
import { useLikeCoffeeChatReview } from "@/api/coffeechat/coffeechatReviewApi";
import MemberImage from '@/components/common/MemberImage';
import { useImageSize } from '@/hooks/useImageSize';

interface ReviewCardProps {
  item: CoffeeChatReviewSummary;
}

export default function ReviewCard({ item }: ReviewCardProps) {
  const [liked, setLiked] = useState(item.liked); 
  const [likesCount, setLikesCount] = useState(item.likesCount); 

  const navigate = useNavigate();
  const {
    data: membersData,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useCoffeeChatMembers(item.coffeeChatId);

  const handleClick = () => {
    navigate(`/coffeechat/${item.coffeeChatId}/review`, {
      state: {
        viewOnly: true,
        coffeeChatId: item.coffeeChatId,
      },
    });
  };

  const likeMutation = useLikeCoffeeChatReview(item.coffeeChatId);

  const handleLikeToggle = (newLiked: boolean) => {
    if (likeMutation.isLoading) return;

    likeMutation.mutateFn();

    setLiked(newLiked);
    setLikesCount((prev) => prev + (newLiked ? 1 : -1));
  };

  useEffect(() => {
    setLiked(item.liked);
    setLikesCount(item.likesCount);
  }, [item.liked, item.likesCount]);

  const size = useImageSize(item.previewImageUrl);

  return (
    <SectionCard className="!px-2 cursor-pointer !border-gray-200" onClick={handleClick}>
      {/* 이미지 영역 */}
      <div className="mb-3">
        <div className="w-32 h-32 mx-auto rounded-2xl relative overflow-hidden">
          {item.previewImageUrl ? (
            <img
              src={item.previewImageUrl}
              alt="preview"
              width={size?.width}
              height={size?.height}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FE9400]/20 to-gray-200 flex items-center justify-center">
              <img src={Icon} alt="icon" width={952} height={953} className="w-13 h-13 object-contain" />
            </div>
          )}

          {item.imagesCount > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
              {item.imagesCount}
            </div>
          )}
        </div>
      </div>

      {/* 제목 */}
      <h3 className="font-semibold text-sm text-gray-800 truncate mb-2 z-10 relative px-2">
        {item.title}
      </h3>

      {/* 멤버 & 하트 */}
      <div className="relative text-xs text-gray-500 z-10 px-2">
        <div className="flex justify-between items-center mt-1 min-h-[24px]">
          {isMembersLoading ? (
            <span className="text-gray-400 text-xs">불러오는 중...</span>
          ) : isMembersError ? (
            <span className="text-red-400 text-xs">에러</span>
          ) : (
            <>
              <div className="flex items-center -space-x-2.5">
                {membersData?.members.slice(0, 2).map((member: any) => (
                  <MemberImage
                    key={member.memberId}
                    url={member.profileImageUrl}
                    alt={member.chatNickname}
                    className="w-6 h-6 border border-white"
                  />
                ))}
                {membersData?.totalMemberCounts && membersData?.totalMemberCounts > 2 && (
                  <div className="w-6 h-6 rounded-full border border-white bg-gray-200 text-[10px] text-gray-600 flex items-center justify-center">
                    +{membersData.totalMemberCounts - 2}
                  </div>
                )}
              </div>

              <HeartButton
                liked={liked}
                likeCount={likesCount}
                onToggle={handleLikeToggle}
              />
            </>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

