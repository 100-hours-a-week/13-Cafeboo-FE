import { Clock, MapPin, Users, Hash } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import type { CoffeeChatListItem } from "@/api/coffeechat/coffeechat.dto";

interface ChatCardProps {
  room: CoffeeChatListItem;
  filter: string;         
  selected: boolean;
  onClick: () => void;
}

export default function ChatCard({ room, filter, selected, onClick }: ChatCardProps) {
  const isJoined = filter === "JOINED" || (filter === "ALL" && room.isJoined);
  const isCompleted = filter === "REVIEWABLE";

  return (
    <SectionCard
      className={`transition-all duration-200 hover:shadow-md hover:scale-[1.01] !py-3 ${
        selected ? "shadow-lg" : "hover:border-gray-200"
      }`}
    >
      <div onClick={onClick} className="cursor-pointer">
        {/* 참여 상태 뱃지 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {isJoined ? (
              <div className="inline-flex items-center bg-[#CCF1E1] text-green-700 px-2 py-1 rounded-xs text-xs font-semibold mb-2">
                참여 중
              </div>
            ) : (
              <div className="inline-flex items-center bg-[#FE9400]/10 text-amber-600 px-2 py-1 rounded-xs text-xs font-semibold mb-2">
                모집 중
              </div>
            )}
            <h3 className="font-semibold text-lg leading-tight mb-2">
              {room.title}
            </h3>
            <div className="flex items-center text-gray-500 text-sm space-x-3">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{room.time}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{room.address}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            <Users className="w-4 h-4 mr-1" />
            {room.currentMemberCount} / {room.maxMemberCount}
          </div>

        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {room.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-xs text-xs font-medium"
            >
              <Hash className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <hr className="my-2 border-gray-200" />

        {/* 방장 및 후기 버튼 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              {room.writer.profileImageUrl ? (
                <img
                  src={room.writer.profileImageUrl}
                  alt={room.writer.chatNickname}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{room.writer.chatNickname}</p>
              <p className="text-xs text-gray-500">방장</p>
            </div>
          </div>

          {/* 후기 버튼 조건 */}
          {!isCompleted && room.isReviewed === false && (
            <div className="flex gap-2">
              <button className="text-[#FE9400] bg-[#FE9400]/10 text-sm font-medium px-3 py-1.5 rounded-md cursor-pointer">
                리뷰하기
              </button>
              <button className="text-gray-700 bg-gray-100 text-sm font-medium px-3 py-1.5 rounded-md cursor-pointer">
                보기
              </button>
            </div>
          )}
          {isCompleted && room.isReviewed === true && (
            <button className="border-1 border-[#FE9400] text-[#FE9400] text-sm font-medium px-3 py-1.5 rounded-md cursor-pointer">
              후기 보기
            </button>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

