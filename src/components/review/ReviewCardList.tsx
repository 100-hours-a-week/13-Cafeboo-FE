import { useState, useEffect } from "react";
import { FilePen, SlidersHorizontal } from "lucide-react";
import { useCoffeeChatReviews } from "@/api/coffeechat/coffeechatReviewApi";
import { useCoffeeChatMembership } from "@/api/coffeechat/coffeechatMemberApi";
import EmptyState from "@/components/common/EmptyState";
import ReviewCard from "@/components/review/ReviewCard";

export default function ReviewCardList() {
  const [filter, setFilter] = useState<"ALL" | "MY">("ALL");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
    refetch: refetchReviews,
  } = useCoffeeChatReviews(filter);
  
  const reviews = reviewsData?.coffeeChatReviews ?? [];

  useEffect(() => {
    refetchReviews();
  }, [filter]);

  return (
    <>
      {/* 필터 아이콘 버튼 + 드롭다운 */}
      <div className="sticky top-0 z-20 bg-white px-1">
        <div className="flex justify-end relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            title="필터 선택"
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-700" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-8 w-22 bg-white border border-gray-200 rounded-md shadow text-sm overflow-hidden z-30">
              <button
                onClick={() => {
                  setFilter("ALL");
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 ${filter === "ALL" ? "bg-gray-200 font-medium cursor-default" : "hover:bg-gray-50 cursor-pointer"}`}
              >
                전체 후기
              </button>
              <button
                onClick={() => {
                  setFilter("MY");
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 ${filter === "MY" ? "bg-gray-200 font-medium cursor-default" : "hover:bg-gray-50 cursor-pointer"}`}
              >
                참여 후기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 후기 카드 리스트 */}
      <div className="grid grid-cols-2 gap-4">
        {isReviewsLoading && (
          <div className="col-span-2 text-center py-10 text-sm text-gray-500">불러오는 중...</div>
        )}
        {isReviewsError && (
          <div className="col-span-2 text-center py-10 text-sm text-red-500">리뷰 불러오기에 실패했습니다.</div>
        )}
        {!isReviewsLoading && !isReviewsError && reviews.length === 0 && (
          <div className="col-span-2">
            <EmptyState
              title="아직 작성된 후기가 없어요"
              description="첫 번째 후기를 남겨보세요."
              icon={<FilePen />}
            />
          </div>
        )}

        {!isReviewsLoading && !isReviewsError &&
          reviews.map((item) => (
            <ReviewCard key={item.coffeeChatId} item={item} />
          ))}
      </div>
    </>
  );
}


  