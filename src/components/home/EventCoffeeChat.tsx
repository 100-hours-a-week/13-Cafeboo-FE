import { useNavigate } from "react-router-dom";
import HorizontalScroller from "@/components/common/HorizontalScroller";
import SectionCard from "@/components/common/SectionCard";
import { Users, ChevronRight } from "lucide-react";
import LoginRequiredModal from "../common/LoginRequiredModal";

interface Writer {
    memberId: string;
    chatNickname: string;
    profileImageUrl: string;
    isHost: boolean;
}

interface EventCoffeeChatRoom {
  coffeeChatId: string;
  title: string;
  time: string;
  address: string;
  currentMemberCount: number;
  maxMemberCount: number;
  writer: Writer;
}

interface TodayEventCoffeeChatSectionProps {
  rooms: EventCoffeeChatRoom[];
  isGuest: boolean;
  isLoginAlertOpen: boolean;
  onLoginAlertOpen: () => void;
  onLoginAlertClose: () => void;
}

export default function EventCoffeeChat({
  rooms,
  isGuest,
  isLoginAlertOpen,
  onLoginAlertOpen,
  onLoginAlertClose,
}: TodayEventCoffeeChatSectionProps) {
  const navigate = useNavigate();

  const handleCardClick = (coffeeChatId: string) => {
    if (isGuest) {
      onLoginAlertOpen();
    } else {
      navigate(`/coffeechat/${coffeeChatId}`);
    }
  };

  return (
    <div>
      <h2 className="mt-6 mb-2 text-base text-[#333333] font-semibold">
        🎉이벤트 커피챗🎉
      </h2>

      {/* 카드 스크롤 영역 */}
      <HorizontalScroller className="justify-start">
        {rooms.length === 0 ? (
          <div className="text-sm text-gray-500">이벤트 커피챗이 없습니다.</div>
        ) : (
          rooms.map((room) => (
            <SectionCard
              key={room.coffeeChatId}
              onClick={() => handleCardClick(room.coffeeChatId)}
              className="!w-[200px] flex-shrink-0 cursor-pointer mr-3 px-2 py-2 !ml-0"
            >
              <div className="flex items-center gap-3">
                {/* 왼쪽 이미지 영역 */}
                <div className="flex items-center justify-center w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={room.writer.profileImageUrl}
                    alt="chat avatar"
                    className="h-15 w-15 object-cover"
                  />
                </div>

                {/* 오른쪽 정보 영역 */}
                <div className="flex flex-col flex-1 overflow-hidden">
                  <h3 className="text-sm font-semibold truncate">{room.title}</h3>
                  <p className="text-[8pt] mt-0.5 truncate">
                    {room.time} · {room.address}
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-gray-700 mt-0.5">
                    <Users size={12} className="text-[#FE9400]" />
                    {room.currentMemberCount} / {room.maxMemberCount}명 참여 중
                  </p>
                </div>
              </div>
            </SectionCard>
          ))
        )}
      </HorizontalScroller>

      <LoginRequiredModal
        isOpen={isLoginAlertOpen}
        onClose={onLoginAlertClose}
      />
    </div>
  );
}
