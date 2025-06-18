import { useState, useEffect } from 'react';
import { Heart, Clock, MapPin, User, Hash, Users, FilePen } from 'lucide-react';
import SectionCard from '@/components/common/SectionCard';
import { useCoffeeChatReviewDetail, useLikeCoffeeChatReview } from "@/api/coffeechat/coffeechatReviewApi";
import EmptyState from '@/components/common/EmptyState';
import HeartButton from '../common/HeartButton';

interface Props {
  coffeeChatId: string;
}

interface Writer {
  name: string;
  profileImageUrl: string;
}

interface Review {
  reviewId: string;
  text: string;
  imageUrls: string[];
  writer: Writer;
}

interface CoffeeChatData {
  coffeechatId: string;
  title: string;
  time: string;
  tags: string[];
  address: string;
  likeCount: number;
  liked: boolean;
  reviews: Review[];
}

export default function ViewReviewForm({ coffeeChatId }: Props) {
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    data: coffeeChatData,
    isLoading,
    isError,
    error,
  } = useCoffeeChatReviewDetail(coffeeChatId);

  const [liked, setLiked] = useState<boolean>(coffeeChatData?.liked ?? false);
  const [likeCount, setLikeCount] = useState<number>(coffeeChatData?.likeCount ?? 0);

  useEffect(() => {
    if (coffeeChatData) {
      setLiked(coffeeChatData.liked);
      setLikeCount(coffeeChatData.likeCount);
    }
  }, [coffeeChatData]);

  const likeMutation = useLikeCoffeeChatReview(coffeeChatId);

  if (isLoading) {
    return <div className="text-sm text-center text-gray-500">로딩 중...</div>;
  }

  if (isError || !coffeeChatData) {
    return <div className="text-sm text-center text-red-500">후기를 불러오는 데 실패했습니다.</div>;
  }

  const handleLikeToggle = (newLiked: boolean) => {
    // API 호출
    if (likeMutation.isLoading) return;

    likeMutation.mutateFn();

    // 로컬 상태 업데이트
    setLiked(newLiked);
    setLikeCount((prev) => prev + (newLiked ? 1 : -1));
  };

  const renderImages = (imageUrls: string[]) => {
    if (imageUrls.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {imageUrls.map((url, index) => (
          <div key={index} className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
            <img 
              src={url} 
              alt={`후기 이미지 ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // 이미지 로드 실패시 플레이스홀더 표시
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-lg">✕</div>';
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-lg font-semibold mb-2">{coffeeChatData.title}</h1>

        {/* 시간 / 위치 / 인원 + 하트 버튼 줄 */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
          {/* 왼쪽: 시간 / 위치 / 인원 */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{coffeeChatData.time}</span>
            </div>
            <div className="text-gray-400">|</div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{coffeeChatData.address}</span>
            </div>
            <div className="text-gray-400">|</div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>3명</span>
            </div>
          </div>

          {/* 오른쪽: 하트 버튼 */}
          <HeartButton
            initiallyLiked={liked}
            likeCount={likeCount}
            onToggle={handleLikeToggle}
          />
        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {coffeeChatData.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-xs text-xs font-medium"
            >
              <Hash className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </section>


      {/* 참여자 후기 섹션 */}
        <h2 className="font-semibold mb-4">참여자 후기</h2>
        {coffeeChatData.reviews.length === 0 ? (
          <EmptyState
            title="아직 작성된 후기가 없어요"
            description="참여자가 후기를 남기면 이곳에 표시됩니다."
            icon={<FilePen className="w-8 h-8" />}
          />
        ) : (
        <div className="space-y-4">
          {coffeeChatData.reviews.map((review) => (
            <SectionCard>
            <div key={review.reviewId}>
              {/* 이미지 그리드 */}
              {renderImages(review.imageUrls)}
              
              {/* 후기 내용 */}
              <p className="text-sm text-[#333333] mb-3">{review.text}</p>
              
              {/* 작성자 정보 */}
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gray-300 rounded-full overflow-hidden">
                  <img 
                    src={review.writer.profileImageUrl} 
                    alt={review.writer.chatNickname}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg></div>';
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500">{review.writer.chatNickname}</span>
              </div>
            </div>
            </SectionCard>
          ))}
        </div>
        )}
      </div>
  );
};
