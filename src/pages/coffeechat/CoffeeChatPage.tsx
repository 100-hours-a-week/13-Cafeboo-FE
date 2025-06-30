import { useRef, useState, useEffect } from "react";
import PageLayout from "@/layout/PageLayout";
import ChatTab from "@/components/coffeechat/ChatTab";
import ChatCardList from "@/components/coffeechat/ChatCardList";
import ReviewCardList from "@/components/review/ReviewCardList";
import { useNavigate } from "react-router-dom";
import ScrollToTop from '@/components/common/ScrolltoTop';
import CoffeeChatBottomSheet from "@/components/coffeechat/CoffeeChatBottomSheet";
import { useCoffeeChatFilter } from "@/stores/useCoffeeChatFilter";
import { useCoffeeChatList } from "@/api/coffeechat/coffeechatListApi";
type ChatFilter = "ALL" | "JOINED" | "REVIEWABLE" | "REVIEWS";

export default function CoffeeChatPage() {
  const filter = useCoffeeChatFilter((state) => state.filter);
  const setFilter = useCoffeeChatFilter((state) => state.setFilter);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isReviewTab = filter === "REVIEWS";
  
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useCoffeeChatList(filter, {
    enabled: !isReviewTab,
  });

  const coffeechats = data?.coffeechats ?? [];

  const handleTabClick = (tab: ChatFilter) => {
    if (filter === tab) {
      refetch(); 
    } else {
      setFilter(tab);
    }
  };

  return (
    <>
    <PageLayout
      headerMode="logo"
      mainRef={mainRef}
      showAdd={true}
      onAddClick={() => setIsSheetOpen(true)}
    >
      <ChatTab filter={filter} onChange={handleTabClick} />
      <ScrollToTop key={filter} selector="main" top={0} />
      <div className="space-y-4">
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
    </>
  );
}

