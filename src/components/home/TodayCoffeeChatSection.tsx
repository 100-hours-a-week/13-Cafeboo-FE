// components/home/TodayCoffeeChatSection.tsx

import { useNavigate } from "react-router-dom";
import { useCoffeeChatList } from "@/api/coffeechat/coffeechatListApi";
import HorizontalScroller from "@/components/common/HorizontalScroller";
import SectionCard from "@/components/common/SectionCard";
import Icon from "@/assets/coffeechat3D.png";
import { Users } from "lucide-react";

export default function TodayCoffeeChatSection() {
  const navigate = useNavigate();
  const { data } = useCoffeeChatList("ALL");
  const rooms = data?.coffeechats?.slice(0, 5) ?? [];

  return (
    <div className="mt-4">
      {/* 제목 & 더보기 버튼 */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-base font-semibold text-[#333333]">오늘의 커피챗</h2>
        <button
          onClick={() => navigate("/main/coffeechat")}
          className="flex items-center justify-center rounded-full border border-gray-300 bg-white px-1.5 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
         더보기 &gt;
        </button>
      </div>

      {/* 카드 스크롤 영역 */}
      <HorizontalScroller className="px-1">
        {rooms.length === 0 ? (
          <div className="text-sm text-gray-500">오늘의 커피챗이 없습니다.</div>
        ) : (
          rooms.map((room) => (
            <SectionCard
                key={room.coffeeChatId}
                onClick={() => navigate(`/main/coffeechat/${room.coffeeChatId}`)}
                className="!w-[200px] flex-shrink-0 cursor-pointer mr-3 px-3 py-2"
                >
                <div className="flex items-center gap-3">
                    {/* 왼쪽 아이콘 영역 */}
                    <div className="flex items-center justify-center w-16 h-16 rounded-md overflow-hidden bg-gray-50">
                    <img
                        src={Icon}
                        alt="preview"
                        className="h-14 w-14 object-contain opacity-90"
                    />
                    </div>

                    {/* 오른쪽 정보 영역 */}
                    <div className="flex flex-col flex-1 overflow-hidden">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">{room.title}</h3>

                    <p className="text-[8pt] text-gray-700 mt-0.5 truncate">
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



