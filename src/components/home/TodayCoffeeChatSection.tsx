import { useNavigate } from "react-router-dom";
import { useCoffeeChatList } from "@/api/coffeechat/coffeechatListApi";
import HorizontalScroller from "@/components/common/HorizontalScroller";
import SectionCard from "@/components/common/SectionCard";
import Icon from "@/assets/coffeechat3D.png";
import { Users, ChevronRight } from "lucide-react";

export default function TodayCoffeeChatSection() {
  const navigate = useNavigate();
  const { data } = useCoffeeChatList("ALL");
  const rooms = data?.coffeechats?.slice(0, 5) ?? [];

  return (
    <div className="mt-4">
      {/* 제목 & 더보기 버튼 */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-base font-semibold text-[#333333]">오늘의 커피챗</h2>
        <div className="flex text-xs font-medium items-center justify-center">
        <button
          onClick={() => navigate("/main/coffeechat")}
        >
         <ChevronRight className="w-5 h-5 cursor-pointer text-800"/>
        </button>
        </div>
      </div>

      {/* 카드 스크롤 영역 */}
      <HorizontalScroller className="px-1 justify-start">
        {rooms.length === 0 ? (
          <div className="text-sm text-gray-500">오늘의 커피챗이 없습니다.</div>
        ) : (
          rooms.map((room) => (
            <SectionCard
                key={room.coffeeChatId}
                onClick={() => navigate(`/main/coffeechat/${room.coffeeChatId}`)}
                className="!w-[200px] flex-shrink-0 cursor-pointer mr-3 px-2 py-2 !ml-0"
                >
                <div className="flex items-center gap-3">
                    {/* 왼쪽 아이콘 영역 */}
                    <div className="flex items-center justify-center w-16 h-16 rounded-md overflow-hidden">
                    <img
                        src={Icon}
                        alt="preview"
                        className="h-16 w-16 object-contain opacity-90"
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
    </div>
  );
}



