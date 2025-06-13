import ChatCard from "@/components/coffeechat/ChatCard";
import type { CoffeeChatListItem } from "@/api/coffeechat/coffeechat.dto";

interface ChatCardListProps {
  rooms: CoffeeChatListItem[];
  filter: string;
  isLoading: boolean;
  isError: boolean;
  onRoomClick: (room: CoffeeChatListItem) => void;
  onReviewClick: (room: CoffeeChatListItem) => void;
  onViewClick: (room: CoffeeChatListItem) => void;
}

export default function ChatCardList({
  rooms,
  filter,
  isLoading,
  isError,
  onRoomClick,
  onReviewClick,
  onViewClick,
}: ChatCardListProps) {
  if (isLoading) {
    return <div className="text-center py-12">로딩 중...</div>;
  }
  if (isError) {
    return <div className="text-center text-red-400 py-12">목록을 불러오는 데 실패했습니다.</div>;
  }
  if (!rooms || rooms.length === 0) {
    return <div className="text-center text-gray-400 py-12">해당 커피챗 목록이 없습니다.</div>;
  }

  return (
    <>
      {rooms.map(room => (
        <ChatCard
          key={room.coffeeChatId}
          room={room}
          filter={filter}
          onRoomClick={() => onRoomClick(room)}
          onReviewClick={() => onReviewClick(room)}
          onViewClick={() => onViewClick(room)}
        />
      ))}
    </>
  );
}
