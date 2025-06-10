import { useRef, useState } from "react";
import PageLayout from "@/layout/PageLayout";
import ChatTab from "@/components/coffeechat/ChatTab";
import ChatCard, { ChatRoom } from "@/components/coffeechat/ChatCard";
import { useNavigate } from "react-router-dom";
import ScrollToTop from '@/components/common/ScrolltoTop';
import CoffeeChatBottomSheet from "@/components/coffeechat/CoffeeChatBottomSheet";

const sampleChats: ChatRoom[] = [
  {
    coffeechatId: '123',
    title: "백다방 같이 가실 분~",
    time: "12:15",
    maxMemberCount: 3,
    currentMemberCount: 1,
    tags: ["디카페인", "스터디"],
    address: "분당구 판교동",
    writer: {
      chatNickname: "윤주",
      profileImageUrl: "",
    },
    isJoined: true,
    status: "all",
  },
  {
    coffeechatId: '124',
    title: "점심 같이 하실 분",
    time: "13:00",
    maxMemberCount: 4,
    currentMemberCount: 2,
    tags: ["네트워킹", "커리어"],
    address: "서울시 강남구",
    writer: {
      chatNickname: "지후",
      profileImageUrl: "",
    },
    isJoined: false,
    status: "all",
  },
  {
    coffeechatId: '125',
    title: "커피 한잔 어때요?",
    time: "15:30",
    maxMemberCount: 2,
    currentMemberCount: 2,
    tags: ["라떼", "잡담"],
    address: "부산 해운대구",
    writer: {
      chatNickname: "세린",
      profileImageUrl: "",
    },
    status: "joined",
  },
  {
    coffeechatId: '126',
    title: "스터디 끝나고 한 잔?",
    time: "18:00",
    maxMemberCount: 5,
    currentMemberCount: 4,
    tags: ["공부", "디카페인"],
    address: "대구 수성구",
    writer: {
      chatNickname: "현수",
      profileImageUrl: "",
    },
    status: "joined",
  },
  {
    coffeechatId: '127',
    title: "지난번 모임 어땠나요?",
    time: "10:00",
    maxMemberCount: 3,
    currentMemberCount: 3,
    tags: ["후기", "리뷰"],
    address: "인천 연수구",
    writer: {
      chatNickname: "지연",
      profileImageUrl: "",
    },
    isReviewed: false,
    status: "completed",
  },
  {
    coffeechatId: '128',
    title: "조용한 카페에서 독서해요",
    time: "17:00",
    maxMemberCount: 2,
    currentMemberCount: 1,
    tags: ["독서", "혼카페"],
    address: "제주 제주시",
    writer: {
      chatNickname: "준호",
      profileImageUrl: "",
    },
    isReviewed: true,
    status: "completed",
  },
];

export default function CoffeeChatPage() {
  const [filter, setFilter] = useState("all");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);

  const filteredChats =
    filter === "all" ? sampleChats : sampleChats.filter((c) => c.status === filter);

  return (
    <PageLayout
      headerMode="logo"
      mainRef={mainRef}
      showAdd={true}        
      onAddClick={() => setIsSheetOpen(true)}  
    >
        <ChatTab filter={filter} onChange={setFilter} />
        <ScrollToTop key={filter} selector="main" top={0}/>
        <div className="space-y-4 px-1">
          {filteredChats.map((room) => (
            <ChatCard
              key={room.coffeechatId}
              room={room}
              selected={selectedRoom === room.coffeechatId}
              onClick={() => {
                if (room.status === "completed") {
                  navigate(`/main/coffeechat/${room.coffeechatId}/review`, {
                    state: { isReviewed: room.isReviewed },
                  });
                } else {
                  navigate(`/main/coffeechat/${room.coffeechatId}`);
                }
              }}
            />
          ))}
        </div>
        <CoffeeChatBottomSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </PageLayout>
    
  );
}