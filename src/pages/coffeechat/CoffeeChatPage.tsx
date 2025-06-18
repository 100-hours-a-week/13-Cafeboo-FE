import { useRef, useState } from "react";
import PageLayout from "@/layout/PageLayout";
import ChatTab from "@/components/coffeechat/ChatTab";
import ChatCardList from "@/components/coffeechat/ChatCardList";
import ReviewCardList from "@/components/review/ReviewCardList";
import { useNavigate } from "react-router-dom";
import ScrollToTop from '@/components/common/ScrolltoTop';
import CoffeeChatBottomSheet from "@/components/coffeechat/CoffeeChatBottomSheet";
import { useCoffeeChatFilter } from "@/stores/useCoffeeChatFilter";
import { useCoffeeChatList } from "@/api/coffeechat/coffeechatListApi";

export default function CoffeeChatPage() {
  const filter = useCoffeeChatFilter((state) => state.filter);
  const setFilter = useCoffeeChatFilter((state) => state.setFilter);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isReviewTab = filter === "REVIEWS";

  // 일반 커피챗 목록
  
  const {
    data,
    isLoading,
    isError,
  } = useCoffeeChatList(filter, {
    enabled: !isReviewTab,
  });
  const coffeechats = data?.coffeechats ?? [];

  // (REVIEWS는 나중에 별도 API로!)
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
      {isReviewTab ? (
          <ReviewCardList
          />
        ) : (
          <ChatCardList
            rooms={coffeechats}
            filter={filter}
            isLoading={isLoading}
            isError={isError}
            onRoomClick={room =>
              navigate(`/main/coffeechat/${room.coffeeChatId}`)
            }
            onReviewClick={room =>
              navigate(`/main/coffeechat/${room.coffeeChatId}/review`, {
                state: { viewOnly: false, coffeeChatId: room.coffeeChatId },
              })
            }
            onViewClick={room =>
              navigate(`/main/coffeechat/${room.coffeeChatId}/review`, {
                state: { viewOnly: true, coffeeChatId: room.coffeeChatId },
              })
            }
          />
        )}
      </div>
      <CoffeeChatBottomSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </PageLayout>
  );
}

