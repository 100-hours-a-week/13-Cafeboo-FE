import { Heart, Hash, MapPin } from "lucide-react";
import { useCoffeeChatReviews } from "@/api/coffeechat/coffeechatReviewApi";
import EmptyState from "@/components/common/EmptyState";

export default function ReviewCardList() {
  const { data, isLoading, isError } = useCoffeeChatReviews("ALL");
  const reviews = data?.coffeeChatReviews ?? [];

  if (isLoading) return <p className="text-center py-10 text-sm text-gray-500">불러오는 중...</p>;
  if (isError) return <p className="text-center py-10 text-sm text-red-500">리뷰 불러오기에 실패했습니다.</p>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {reviews.length === 0 ? (
        <div className="col-span-2">
          <EmptyState
            title="아직 작성된 후기가 없어요"
            description="첫 번째 후기를 남겨보세요."
            icon={<svg className="w-8 h-8 mx-auto text-[#D1D1D1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 4H8a2 2 0 00-2 2v14l4-4h6a2 2 0 002-2V6a2 2 0 00-2-2z" /></svg>}
          />
        </div>
      ) : (
        reviews.map((item) => (
          <div key={item.coffeeChatId} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            {/* 이미지 */}
            <div className="w-full h-28 bg-gray-100 rounded-lg overflow-hidden mb-3">
              {item.previewImageUrl ? (
                <img src={item.previewImageUrl} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-300">☕</div>
              )}
            </div>

            {/* 제목 */}
            <h3 className="font-semibold text-sm text-gray-800 truncate mb-2">{item.title}</h3>

            {/* 태그 */}
            <div className="flex flex-wrap gap-1 mb-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium"
                >
                  <Hash className="w-3 h-3 mr-1" />{tag}
                </span>
              ))}
            </div>

            {/* 위치, 좋아요 */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{item.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{item.likesCount}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

  