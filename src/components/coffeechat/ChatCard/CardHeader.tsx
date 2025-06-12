import { Users } from "lucide-react";
import type { CoffeeChatListItem } from "@/api/coffeechat/coffeechat.dto";

interface CardHeaderProps {
  room: CoffeeChatListItem;
  filter: string;
}

export default function CardHeader({ room, filter }: CardHeaderProps) {
  if (filter === "REVIEWABLE") return null;

  const isJoined = filter === "JOINED" || (filter === "ALL" && room.isJoined);

  let badge;
  if (isJoined) {
    badge = (
      <div className="inline-flex items-center bg-[#CCF1E1] text-green-800 px-2 py-1 rounded-xs text-xs font-semibold">
        참여 중
      </div>
    );
  } else if (room.currentMemberCount === room.maxMemberCount) {
    badge = (
      <div className="inline-flex items-center bg-purple-100 text-purple-900 px-2 py-1 rounded-xs text-xs font-semibold">
        모집 완료
      </div>
    );
  } else {
    badge = (
      <div className="inline-flex items-center bg-[#FE9400]/10 text-amber-600 px-2 py-1 rounded-xs text-xs font-semibold">
        모집 중
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between mb-3">
      <div>{badge}</div>
      <div className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
        <Users className="w-4 h-4 mr-1" />
        {room.currentMemberCount} / {room.maxMemberCount}
      </div>
    </div>
  );
}
