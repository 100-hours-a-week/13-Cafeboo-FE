import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCoffeeChatFilter } from "@/stores/useCoffeeChatFilter";
import { useReviewTabStore } from "@/stores/reviewTabStore";
import { useCoffeeChatList } from "@/api/coffeechat/coffeechatListApi";
import { useCoffeeChatReviews } from "@/api/coffeechat/coffeechatReviewApi";
import CoffeeChatPageUI from "./CoffeeChatPageUI";
import { useAuthStore } from "@/stores/useAuthStore"; 
import type { ChatFilter, ReviewFilter } from "@/types/filters";

export default function CoffeeChatContainer() {
  const filter = useCoffeeChatFilter((state) => state.filter);
  const reviewTabFilter = useReviewTabStore(state => state.filter);
  const setFilter = useCoffeeChatFilter((state) => state.setFilter);
  const setReviewTabFilter = useReviewTabStore(state => state.setFilter);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoginAlertOpen, setIsLoginAlertOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isGuest = useAuthStore(state => state.isGuest());
  const isReviewTab = filter === "REVIEWS";

  const {
    data: coffeeChatData,
    isLoading: isLoadingChats,
    isError: isErrorChats,
    refetch: refetchChats,
  } = useCoffeeChatList(filter, {
    enabled: !isReviewTab,
    staleTime: 0,
  });

  const {
    data: reviewData,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
    refetch: refetchReviews,
  } = useCoffeeChatReviews(reviewTabFilter, {
    enabled: isReviewTab,
    staleTime: 0,
  });

  const coffeechats = coffeeChatData?.coffeechats ?? [];

  // 핸들러 함수들
  const handleTabClick = (tab: ChatFilter) => {
    if (isLoginAlertOpen) {
      setIsLoginAlertOpen(false);
    }
    if (filter === tab) {
      if (isReviewTab) {
        refetchReviews();
      } else {
        refetchChats();
      }
    } else {
      setFilter(tab);
    }
  };

  useEffect(() => {
    console.log('isLoginAlertOpen changed:', isLoginAlertOpen);
  }, [isLoginAlertOpen]);

  const handleReviewTabClick = (tab: ReviewFilter) => {
    if (reviewTabFilter === tab) {
      refetchReviews();
    } else {
      setReviewTabFilter(tab);
    }
  };

  const handleRoomClick = (room: any) => {
    if (isGuest) {
      setIsLoginAlertOpen(true);
    } else {
      navigate(`/coffeechat/${room.coffeeChatId}`);
    }
  };

  const handleReviewClick = (room: any) => {
    navigate(`/coffeechat/${room.coffeeChatId}/review`, {
      state: { viewOnly: false, coffeeChatId: room.coffeeChatId },
    });
  };

  const handleViewClick = (room: any) => {
    navigate(`/coffeechat/${room.coffeeChatId}/review`, {
      state: { viewOnly: true, coffeeChatId: room.coffeeChatId },
    });
  };

  const handleAddClick = () => {
    if (isGuest) {
      setIsLoginAlertOpen(true);
    } else {
      setIsSheetOpen(true);
    }
  };

  // 상태 객체
  const status = {
    filter,
    reviewFilter: reviewTabFilter,
    isReviewTab,
    coffeechats,
    reviewData,
    isLoadingChats,
    isErrorChats,
    isLoadingReviews,
    isErrorReviews,
    isSheetOpen,
    mainRef,
    isGuest,
    isLoginAlertOpen,
  };

  // 핸들러 객체
  const handlers = {
    onRoomClick: handleRoomClick,
    onReviewClick: handleReviewClick,
    onViewClick: handleViewClick,
    onTabChange: handleTabClick,
    onReviewTabChange: handleReviewTabClick,
    reviewTabSetFilter: setReviewTabFilter,
    onAddClick: handleAddClick,
    onLoginAlertClose: () => setIsLoginAlertOpen(false),
    onCloseSheet: () => setIsSheetOpen(false),
  };

  return <CoffeeChatPageUI status={status} handlers={handlers} />;
}
