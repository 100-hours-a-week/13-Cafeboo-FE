import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import SectionCard from "@/components/common/SectionCard";
import type { CoffeeChatListItem } from "@/api/coffeechat/coffeechat.dto";

interface ChatCardProps {
  room: CoffeeChatListItem;
  filter: string;
  onRoomClick: () => void;
  onReviewClick: () => void;
  onViewClick: () => void;
}

export default function ChatCard({
  room,
  filter,
  onRoomClick,
  onReviewClick,
  onViewClick,
}: ChatCardProps) {
  const isClickable = filter !== "REVIEWABLE";
  return (
    <SectionCard
      className={
        "transition-all duration-200 hover:shadow-md !py-3" +
        (isClickable ? " cursor-pointer" : "")
      }
      onClick={isClickable ? onRoomClick : undefined}
    >
      <div>
        <CardHeader room={room} filter={filter} />
        <CardBody room={room} />
        <CardFooter
          room={room}
          filter={filter}
          onRoomClick={onRoomClick}
          onReviewClick={onReviewClick}
          onViewClick={onViewClick}
        />
      </div>
    </SectionCard>
  );
}


