import { Clock, MapPin, Hash } from "lucide-react";
import type { CoffeeChatListItem } from "@/api/coffeechat/coffeechat.dto";

interface CardBodyProps {
  room: CoffeeChatListItem;
}

export default function CardBody({ room }: CardBodyProps) {
  return (
    <div>
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

      {/* 태그 */}
      {room.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 mt-2">
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
      )}

      <hr className={`my-2 border-gray-200 ${room.tags.length == 0 ? "mt-4" : ""}`} />
    </div>
  );
}
