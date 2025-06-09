import { Clock, MapPin, Users, Hash } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";

interface Writer {
  name: string;
  profileImageUrl: string;
}

export interface ChatRoom {
  coffeechatId: string;
  title: string;
  time: string;
  address: string;
  maxMemberCount: number;
  currentMemberCount: number;
  status: string;
  tags: string[];
  writer: Writer;
  reviewType?: "write" | "view";
}

interface ChatCardProps {
  room: ChatRoom;
  selected: boolean;
  onClick: () => void;
}

export default function ChatCard({ room, selected, onClick }: ChatCardProps) {
  return (
    <SectionCard
      className={`transition-all duration-200 hover:shadow-md hover:scale-[1.01] !py-3 ${
        selected ? "shadow-lg" : "hover:border-gray-200"
      }`}
    >
      <div onClick={onClick} className="cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {room.status === "joined" ? (
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

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {room.writer.profileImageUrl ? (
                <img
                  src={room.writer.profileImageUrl}
                  alt={room.writer.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300">

                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{room.writer.name}</p>
              <p className="text-xs text-gray-500">방장</p>
            </div>
          </div>
          {room.reviewType === "write" && (
            <button className="border-1 border-[#FE9400] text-[#FE9400] text-sm font-medium px-3 py-1.5 rounded-md">후기 쓰기</button>
            )}
          {room.reviewType === "view" && (
            <button className="border-1 border-[#FE9400] text-[#FE9400] text-sm font-medium px-3 py-1.5 rounded-md">내 후기 보기</button>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
