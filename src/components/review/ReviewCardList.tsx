import { useEffect, useRef, useState } from 'react';
import { FilePen } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import ReviewCard from '@/components/review/ReviewCard';
import type { ReviewFilter } from '@/types/filters';

const REVIEW_TABS: { value: ReviewFilter; label: string }[] = [
  { value: 'ALL', label: '전체 후기' },
  { value: 'MY', label: '참여 후기' },
];

type ReviewCardListProps = {
  filter: ReviewFilter;
  setFilter: (filter: ReviewFilter) => void;
  reviewsData?: {
    coffeeChatReviews?: Array<{ coffeeChatId: string } & any>;
  };
  isLoading: boolean;
  isError: boolean;
  onRequireLogin: () => void;
};

export default function ReviewCardList({
  filter,
  setFilter,
  reviewsData,
  isLoading,
  isError,
  onRequireLogin,
}: ReviewCardListProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const initialFilter = useRef(filter);
  const [hasSwitched, setHasSwitched] = useState(false);

  useEffect(() => {
    const idx = REVIEW_TABS.findIndex((tab) => tab.value === filter);
    const el = tabRefs.current[idx];
    if (el) {
      const { offsetLeft, clientWidth } = el;
      setIndicatorStyle({ left: offsetLeft, width: clientWidth });
    }

    if (filter !== initialFilter.current) {
      setHasSwitched(true);
    }
  }, [filter]);

  const reviews = [...(reviewsData?.coffeeChatReviews ?? [])].reverse();

  const handleTabClick = (tab: ReviewFilter) => {
    if (filter !== tab) {
      setFilter(tab);
    }
  };

  return (
    <>
      {/* 상단 탭 */}
      <div className="sticky top-0 z-20 bg-white py-1">
        <div className="relative flex w-full rounded-sm p-1 space-x-0.5 bg-gray-100">
          <div
            className={`absolute top-[3px] h-[calc(100%-6px)] rounded-sm shadow bg-white z-0 
              ${hasSwitched ? 'transition-all duration-300 ease-in-out' : ''}
            `}
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          />
          {REVIEW_TABS.map((tab, idx) => (
            <button
              key={tab.value}
              ref={(el) => (tabRefs.current[idx] = el)}
              onClick={() => handleTabClick(tab.value)}
              className={`flex-1 px-3 py-[6px] text-sm font-medium rounded-sm transition-colors duration-200 z-10 cursor-pointer
                ${filter === tab.value ? 'text-black' : 'text-gray-500 hover:text-black'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 후기 카드 리스트 */}
      <div className="grid grid-cols-2 gap-4">
        {isLoading && (
          <div className="col-span-2 text-center py-10 text-sm text-gray-500">
            불러오는 중...
          </div>
        )}
        {isError && (
          <div className="col-span-2 text-center py-10 text-sm text-red-500">
            리뷰 불러오기에 실패했습니다.
          </div>
        )}
        {!isLoading && !isError && reviews.length === 0 && (
          <div className="col-span-2">
            <EmptyState
              title="아직 작성된 후기가 없어요"
              description="첫 번째 후기를 남겨보세요."
              icon={<FilePen />}
            />
          </div>
        )}

        {!isLoading &&
          !isError &&
          reviews.map((item) => (
            <ReviewCard
              key={item.coffeeChatId}
              item={item}
              onRequireLogin={onRequireLogin}
            />
          ))}
      </div>
    </>
  );
}
