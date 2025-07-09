import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CoffeeChatReviewPageUI from './CoffeeChatReviewPageUI';
import { 
  useCoffeeChatReviewDetail, 
  useLikeCoffeeChatReview, 
  useWriteCoffeeChatReview 
} from '@/api/coffeechat/coffeechatReviewApi';
import { 
  useCoffeeChatMembers,
  useCoffeeChatMembership,
} from '@/api/coffeechat/coffeechatMemberApi';
import { useCoffeeChatDetail } from '@/api/coffeechat/coffeechatApi';

export default function CoffeeChatReviewPageContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { viewOnly, coffeeChatId } = location.state || {};

  const {
    data: coffeeChatData,
    isLoading,
    isError,
  } = viewOnly
    ? useCoffeeChatReviewDetail(coffeeChatId ?? '')
    : useCoffeeChatDetail(coffeeChatId ?? '');

  const { data: membersData } = useCoffeeChatMembers(coffeeChatId ?? '');
  const { data: membershipData} = useCoffeeChatMembership(coffeeChatId ?? '');

  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  const likeMutation = useLikeCoffeeChatReview(coffeeChatId ?? '');

  useEffect(() => {
    if (viewOnly && coffeeChatData && 'liked' in coffeeChatData) {
      setLiked(coffeeChatData.liked);
      setLikeCount(coffeeChatData.likeCount);
    }
  }, [viewOnly, coffeeChatData]);

  const handleLikeToggle = (newLiked: boolean) => {
    if (likeMutation.isLoading) return;
    likeMutation.mutateFn();
    setLiked(newLiked);
    setLikeCount((prev) => prev + (newLiked ? 1 : -1));
  };

  const writeReviewMutation = useWriteCoffeeChatReview(coffeeChatId ?? '');


  const handleWriteReviewSubmit = async (params: { memberId: string; text: string; images: File[] }) => {
    try {
      await writeReviewMutation.mutateAsyncFn(params);
      navigate('/coffeechat');
    } catch (error) {
      throw error;
    }
  };

  return (
    <CoffeeChatReviewPageUI
      viewOnly={!!viewOnly}
      coffeeChatId={coffeeChatId}
      coffeeChatData={coffeeChatData}
      membersData={membersData}
      membershipData={membershipData}
      isLoading={isLoading}
      isError={isError}
      navigate={navigate}
      liked={liked}
      likeCount={likeCount}
      onLikeToggle={handleLikeToggle}
      onWriteSubmit={handleWriteReviewSubmit}
      writeReviewLoading={writeReviewMutation.isLoading}
    />
  );
}
