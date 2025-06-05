import { useRef, useState } from "react";
import PageLayout from "@/layout/PageLayout";
import ChatTab from "@/components/coffeechat/ChatTab";
import ChatCard, { ChatRoom } from "@/components/coffeechat/ChatCard";
import { useNavigate } from "react-router-dom";
import ScrollToTop from '@/components/common/ScrolltoTop';
import CoffeeChatBottomSheet from "@/components/coffeechat/CoffeeChatBottomSheet";

const sampleChats: ChatRoom[] = [
    {
        coffeechatId: "123",
        title: "백다방 같이 가실 분~",
        time: "12:15",
        address: "분당구 판교동",
        maxMemberCount: 3,
        currentMemberCount: 1,
        status: "all",
        tags: ["디카페인", "스터디"],
        writer: {
          name: "윤주",
          profileImageUrl: "",
        },
        reviewType: "write",
    },
    {
      coffeechatId: "124",
      title: "백다방 같이 가실 분~",
      time: "12:15",
      address: "분당구 판교동",
      maxMemberCount: 3,
      currentMemberCount: 1,
      status: "joined",
      tags: ["디카페인", "스터디"],
      writer: {
        name: "윤주",
        profileImageUrl: "",
      },
      reviewType: "view",
  },
  {
    coffeechatId: "125",
    title: "백다방 같이 가실 분~",
    time: "12:15",
    address: "분당구 판교동",
    maxMemberCount: 3,
    currentMemberCount: 1,
    status: "all",
    tags: ["디카페인", "스터디"],
    writer: {
      name: "윤주",
      profileImageUrl: "",
    },
  },
  {
    coffeechatId: "126",
    title: "백다방 같이 가실 분~",
    time: "12:15",
    address: "분당구 판교동",
    maxMemberCount: 3,
    currentMemberCount: 1,
    status: "all",
    tags: ["디카페인", "스터디"],
    writer: {
      name: "윤주",
      profileImageUrl: "",
    },
  },
  {
    coffeechatId: "127",
    title: "백다방 같이 가실 분~",
    time: "12:15",
    address: "분당구 판교동",
    maxMemberCount: 3,
    currentMemberCount: 1,
    status: "joined",
    tags: ["디카페인", "스터디"],
    writer: {
      name: "윤주",
      profileImageUrl: "",
    },
  },
  {
    coffeechatId: "128",
    title: "백다방 같이 가실 분~",
    time: "12:15",
    address: "분당구 판교동",
    maxMemberCount: 3,
    currentMemberCount: 1,
    status: "all",
    tags: ["디카페인", "스터디"],
    writer: {
      name: "윤주",
      profileImageUrl: "",
    },
  },
  {
    coffeechatId: "129",
    title: "백다방 같이 가실 분~",
    time: "12:15",
    address: "분당구 판교동",
    maxMemberCount: 3,
    currentMemberCount: 1,
    status: "all",
    tags: ["디카페인", "스터디"],
    writer: {
      name: "윤주",
      profileImageUrl: "",
    },
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
              onClick={() => navigate(`/main/coffeechat/${room.coffeechatId}`)}
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