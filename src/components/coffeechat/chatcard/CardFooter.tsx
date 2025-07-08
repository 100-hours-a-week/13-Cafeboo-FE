import type { CoffeeChatListItem } from "@/api/coffeechat/coffeechat.dto";

interface CardFooterProps {
  room: CoffeeChatListItem;
  filter: string;
  onRoomClick: () => void;
  onReviewClick: () => void;
  onViewClick: () => void;
}

export default function CardFooter({
  room,
  filter,
  onRoomClick,
  onReviewClick,
  onViewClick,
}: CardFooterProps) {
  // REVIEWABLE 탭에서는 버튼 구조가 다름
  const isReviewable = filter === "REVIEWABLE";

  return (
    <div className="flex items-center justify-between">
      {/* 방장 정보 */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          {room.writer.profileImageUrl ? (
            <img
              src={room.writer.profileImageUrl}
              alt={room.writer.chatNickname}
              width={1000}
              height={1000}
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

      {isReviewable && (
        <div className="flex gap-2">
          {room.isReviewed ? (
            // 이미 후기 작성됨: "리뷰완료" (비활성), "보기" (활성)
            <>
              <button
                className="text-[#FE9400]/60 bg-[#FE9400]/5 text-sm font-medium px-3 py-1.5 rounded-md cursor-default pointer-events-none"
                disabled
                tabIndex={-1}
              >
                리뷰완료
              </button>
              <button
                className="text-gray-700 bg-gray-100 text-sm font-medium px-3 py-1.5 rounded-md cursor-pointer hover:bg-gray-200"
                onClick={onViewClick}
              >
                보기
              </button>
            </>
          ) : (
            <>
              <button
                className="text-[#FE9400] bg-[#FE9400]/10 text-sm font-medium px-3 py-1.5 rounded-md cursor-pointer hover:bg-[#FE9400]/20"
                onClick={onReviewClick}
              >
                리뷰하기
              </button>
              <button
                className="text-gray-700 bg-gray-100 text-sm font-medium px-3 py-1.5 rounded-md cursor-pointer hover:bg-gray-200"
                onClick={onViewClick}
              >
                보기
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
