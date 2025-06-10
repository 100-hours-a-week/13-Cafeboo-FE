import { useState } from 'react';
import { Heart, Clock, MapPin, User, Hash, Users } from 'lucide-react';
import SectionCard from '@/components/common/SectionCard';

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
  reviews: Review[];
}

export default function ViewReviewForm() {
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 샘플 데이터 (실제로는 API에서 받아올 데이터)
  const coffeeChatData: CoffeeChatData = {
    coffeechatId: "123",
    title: "백다방 같이 가실 분~",
    time: "12:15",
    tags: ["디카페인", "스터디"],
    address: "분당구 판교동",
    likeCount: 8,
    reviews: [
      {
        reviewId: "r123",
        text: "처음 뵌 분들과도 금방 친해졌어요. 분위기 최고!",
        imageUrls: [
          "https://your-cdn.com/reviews/review1.png",
          "https://your-cdn.com/reviews/review2.png"
        ],
        writer: {
          name: "윤주",
          profileImageUrl: "https://your-cdn.com/profiles/yunju.png"
        }
      },
      {
        reviewId: "r124",
        text: "다음에도 또 참여하고 싶어요!",
        imageUrls: [],
        writer: {
          name: "나은",
          profileImageUrl: "https://your-cdn.com/profiles/naehun.png"
        }
      }
    ]
  };
  const tags = coffeeChatData.tags;
  const likeCount = coffeeChatData.likeCount;

  const handleLike = () => {
    setIsLiked(prev => {
      const next = !prev;
      
      if (next) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
  
      return next;
    });
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
          <button
            onClick={handleLike}
            className={`relative flex items-center space-x-1 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />

              {isAnimating && (
                <Heart
                  size={18}
                  fill="red"
                  className="absolute left-1/2 top-0] -translate-y-4 text-red-500 animate-float-up"
                />
              )}
            </div>
            <span className="text-sm">{likeCount + (isLiked ? 1 : 0)}</span>
          </button>
        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag: string, index: number) => (
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
                    alt={review.writer.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg></div>';
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500">{review.writer.name}</span>
              </div>
            </div>
            </SectionCard>
          ))}
        </div>
      </div>
  );
};
