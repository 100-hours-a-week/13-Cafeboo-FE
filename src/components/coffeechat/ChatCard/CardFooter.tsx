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

      {/* 후기/리뷰 버튼 */}
      {!isReviewable && (
        // ALL/JOINED: 카드 전체 클릭(onRoomClick)
        <button
          className="w-full h-full absolute left-0 top-0"
          onClick={onRoomClick}
          style={{ opacity: 0, pointerEvents: 'auto', position: 'absolute' }}
          tabIndex={-1}
          aria-hidden
        />
      )}

      {isReviewable && (
        <div className="flex gap-2">
          {room.isReviewed ? (
            // 이미 후기 작성됨: "리뷰완료" [보기] 버튼만
            <button
              className="border border-[#FE9400] text-[#FE9400] text-sm font-medium px-3 py-1.5 rounded-md cursor-pointer"
              onClick={onViewClick}
            >
              리뷰 완료
            </button>
          ) : (
            <>
              <button
                className="text-[#FE9400] bg-[#FE9400]/10 text-sm font-medium px-3 py-1.5 rounded-md cursor-pointer"
                onClick={onReviewClick}
              >
                리뷰하기
              </button>
              <button
                className="text-gray-700 bg-gray-100 text-sm font-medium px-3 py-1.5 rounded-md cursor-pointer"
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
