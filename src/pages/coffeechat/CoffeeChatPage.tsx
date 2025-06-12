import { useRef, useState } from "react";
import PageLayout from "@/layout/PageLayout";
import ChatTab from "@/components/coffeechat/ChatTab";
import ChatCard from "@/components/coffeechat/ChatCard";
import { useNavigate } from "react-router-dom";
import ScrollToTop from '@/components/common/ScrolltoTop';
import CoffeeChatBottomSheet from "@/components/coffeechat/CoffeeChatBottomSheet";
import { useCoffeeChatFilter } from "@/stores/useCoffeeChatFilter";
import { useCoffeeChatList } from "@/api/coffeechat/coffeechatListApi";

export default function CoffeeChatPage() {
  const filter = useCoffeeChatFilter((state) => state.filter);
  const setFilter = useCoffeeChatFilter((state) => state.setFilter);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);

  // "REVIEWS" 탭은 비워둠 (추후 구현)
  const isReviewsTab = filter === "REVIEWS";
  const {
    data,
    isLoading,
    isError,
  } = useCoffeeChatList(filter);

  const coffeechats = data?.coffeechats ?? [];

  return (
    <PageLayout
      headerMode="logo"
      mainRef={mainRef}
      showAdd={true}
      onAddClick={() => setIsSheetOpen(true)}
    >
      <ChatTab filter={filter} onChange={setFilter} />
      <ScrollToTop key={filter} selector="main" top={0} />
      <div className="space-y-4 px-1">
        {isReviewsTab ? (
          <div className="text-center text-gray-400 py-12">
            전체 후기 목록은 추후 제공됩니다.
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">로딩 중...</div>
        ) : isError ? (
          <div className="text-center text-red-400 py-12">목록을 불러오는 데 실패했습니다.</div>
        ) : coffeechats.length === 0 ? (
          <div className="text-center text-gray-400 py-12">해당 커피챗 목록이 없습니다.</div>
        ) : (
          coffeechats.map((room) => (
            <ChatCard
              key={room.coffeechatId}
              room={room}
              filter={filter.toUpperCase()}
              selected={selectedRoom === room.coffeechatId}
              onClick={() => {
                if (filter === "REVIEWABLE" || !room.isReviewed === undefined) {
                  navigate(`/main/coffeechat/${room.coffeechatId}/review`, {
                    state: { isReviewed: room.isReviewed },
                });
                } else {
                  navigate(`/main/coffeechat/${room.coffeechatId}`);
                }
              }}
            />
          ))
        )}
      </div>
      <CoffeeChatBottomSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </PageLayout>
  );
}
