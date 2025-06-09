import PageLayout from "@/layout/PageLayout";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa6";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

interface Sender {
  userId: string;
  name: string;
  profileImageUrl: string;
}

interface ChatMessage {
  messageId: string;
  messageType: "TALK" | "JOIN" | "LEAVE";
  content: string | null;
  sentAt: string;
  sender: Sender;
}

export default function GroupChatPage() {
  const { id: coffeechatId } = useParams(); // 커피챗 ID
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const stompRef = useRef<Client | null>(null);

  const currentUserId = "u123"; // 실제 로그인 유저 ID
  const currentUserName = "나"; // UI에 표시할 내 이름

  // 📡 WebSocket 연결
  useEffect(() => {
    const socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/chat.${coffeechatId}`, (message: IMessage) => {
          const msg: ChatMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, msg]);
        });
      },
    });

    client.activate();
    stompRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [coffeechatId]);

  // ✉️ 메시지 전송
  const sendMessage = () => {
    if (!input.trim() || !stompRef.current?.connected) return;

    const payload = {
      senderId: currentUserId,
      coffeechatId,
      message: input,
    };

    stompRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(payload),
    });

    setInput("");
  };

  // 🧽 자동 스크롤
  useEffect(() => {
    chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // 📅 날짜 포맷
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <PageLayout
      headerMode="title"
      headerTitle="그룹 채팅방"
      onBackClick={() => navigate(`/main/coffeechat/${coffeechatId}`)}
    >
      <div className="flex flex-col h-[calc(100dvh-64px)] bg-gray-50">
        <div className="text-center py-2 text-sm text-gray-500">
          {new Date().toLocaleDateString("ko-KR")}
        </div>

        <div ref={chatBoxRef} className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
          {messages.map((msg, idx) => {
            if (msg.messageType === "JOIN" || msg.messageType === "LEAVE") {
              return (
                <div key={idx} className="text-center text-sm text-gray-400">
                  {msg.sender.name}님이 {msg.messageType === "JOIN" ? "입장했어요." : "퇴장했어요."}
                </div>
              );
            }

            const isMine = msg.sender.userId === currentUserId;
            return (
              <div
                key={idx}
                className={`w-full ${isMine ? "flex justify-end" : "flex justify-start"}`}
              >
                <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[80%]`}>
                  {!isMine && (
                    <div className="text-sm text-gray-600 mb-1">{msg.sender.name}</div>
                  )}
                  <div className={`flex items-end gap-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm shadow max-w-xs whitespace-pre-wrap break-words ${
                        isMine
                          ? "bg-[#FE9400] text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap mb-0.5">
                      {formatTime(msg.sentAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-white px-6 py-3 shadow-md z-10">
          <div className="flex items-center gap-2 max-w-xl mx-auto">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-[#FE9400]"
              placeholder="메시지를 입력하세요"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <div
              onClick={sendMessage}
              className="w-9 h-9 bg-[#FE9400] text-white flex items-center justify-center rounded-full hover:bg-[#FE9400]/80 cursor-pointer"
            >
              <FaArrowUp className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}


