import React from 'react';
import PageLayout from "@/layout/PageLayout";
import ChatTab from "@/components/coffeechat/ChatTab";
import ChatCardList from "@/components/coffeechat/ChatCardList";
import ReviewCardList from "@/components/review/ReviewCardList";
import ScrollToTop from '@/components/common/ScrolltoTop';
import CoffeeChatBottomSheet from "@/components/coffeechat/CoffeeChatBottomSheet";
import type { ChatFilter, ReviewFilter } from "@/types/filters";

interface StatusProps {
  filter: ChatFilter;
  reviewFilter: ReviewFilter;
  isReviewTab: boolean;
  coffeechats: any[];
  reviewData: any;
  isLoadingChats: boolean;
  isErrorChats: boolean;
  isLoadingReviews: boolean;
  isErrorReviews: boolean;
  isSheetOpen: boolean;
  mainRef: React.RefObject<HTMLDivElement>;
}

interface HandlersProps {
  onRoomClick: (room: any) => void;
  onReviewClick: (room: any) => void;
  onViewClick: (room: any) => void;
  onTabChange: (tab: ChatFilter) => void;
  onReviewTabChange: (tab: ReviewFilter) => void;
  reviewTabSetFilter: (val: ReviewFilter) => void;
  onAddClick: () => void;
  onCloseSheet: () => void;
}

interface Props {
  status: StatusProps;
  handlers: HandlersProps;
}

export default function CoffeeChatPageUI({ status, handlers }: Props) {
  const {
    filter,
    reviewFilter,
    isReviewTab,
    coffeechats,
    reviewData,
    isLoadingChats,
    isErrorChats,
    isLoadingReviews,
    isErrorReviews,
    isSheetOpen,
    mainRef,
  } = status;

  const {
    onRoomClick,
    onReviewClick,
    onViewClick,
    onTabChange,
    onReviewTabChange,
    reviewTabSetFilter,
    onAddClick,
    onCloseSheet,
  } = handlers;

  return (
    <PageLayout
      headerMode="logo"
      mainRef={mainRef}
      showAdd={true}
      onAddClick={onAddClick}
    >
      <ChatTab filter={filter} onChange={onTabChange} />
      <ScrollToTop key={filter} selector="main" top={0} />
      <div className="space-y-4">
        {isReviewTab ? (
          <ReviewCardList
            filter={reviewFilter}
            setFilter={reviewTabSetFilter}
            reviewsData={reviewData}
            isLoading={isLoadingReviews}
            isError={isErrorReviews}
          />
        ) : (
          <ChatCardList
            rooms={coffeechats}
            filter={filter}
            isLoading={isLoadingChats}
            isError={isErrorChats}
            onRoomClick={onRoomClick}
            onReviewClick={onReviewClick}
            onViewClick={onViewClick}
          />
        )}
      </div>
      <CoffeeChatBottomSheet open={isSheetOpen} onClose={onCloseSheet} />
    </PageLayout>
  );
}
