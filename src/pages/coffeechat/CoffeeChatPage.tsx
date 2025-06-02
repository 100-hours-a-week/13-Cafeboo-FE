import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Header from "@/components/common/Header";
import ChatTab from "@/components/coffeechat/ChatTab";
import ChatCard, {ChatRoom} from "@/components/coffeechat/ChatCard";

const sampleChats: ChatRoom[] = [
    {
        coffeechatId: "123",
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
    status: "joined",
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
    status: "joined",
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
    status: "joined",
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
    status: "joined",
    tags: ["디카페인", "스터디"],
    writer: {
      name: "윤주",
      profileImageUrl: "",
    },
  },


];

export default function CoffeeChatPage() {
  const [filter, setFilter] = useState("joined");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isLarge, setIsLarge] = useState(window.innerWidth >= 450 && window.innerWidth < 1024);

  const filteredChats =
    filter === "all" ? sampleChats : sampleChats.filter((c) => c.status === filter);

  useEffect(() => {
    const handleResize = () => {
      setIsLarge(window.innerWidth >= 450);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <Header mode="logo" />
      <main className="pt-16">
        <ChatTab filter={filter} onChange={setFilter} />
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-56px)] scrollbar-hide">
          {filteredChats.map((room) => (
            <ChatCard
              key={room.coffeechatId}
              room={room}
              selected={selectedRoom === room.coffeechatId}
              onClick={() => setSelectedRoom(room.coffeechatId)} 
            />
          ))}
        </div>
        <button
          className={`fixed bottom-6 ${isLarge? 'right-[calc(50%_-_225px_+_20px)]' : 'right-5'} w-12 h-12 cursor-pointer rounded-full bg-[#FE9400] text-white flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)] lg:left-224 xl:left-288 2xl:left-352`}
          onClick={() => {}}
          >
          <Plus size={24} />
        </button>
      </main>
    </div>
  );
}