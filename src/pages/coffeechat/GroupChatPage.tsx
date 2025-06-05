import PageLayout from "@/layout/PageLayout";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa6";

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
}

export default function GroupChatPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // 커피챗 ID
  const username = "나"; // 임시 닉네임
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg: ChatMessage = {
      sender: username,
      content: input,
      timestamp: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };

    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <PageLayout
      headerMode="title"
      headerTitle="그룹 채팅방"
      onBackClick={() => navigate(`/main/coffeechat/${id}`)}
    >
      <div className="flex flex-col h-[calc(100dvh-64px)] bg-gray-50">
        {/* 날짜 */}
        <div className="text-center py-2 text-sm text-gray-500">
          {new Date().toLocaleDateString("ko-KR")}
        </div>

        {/* 채팅 메시지 영역 */}
        <div
          ref={chatBoxRef}
          className="flex-1 overflow-y-auto px-4 space-y-3 pb-4"
        >
          {messages.map((msg, idx) => {
            const isMine = msg.sender === username;
            return (
              <div
                key={idx}
                className={`w-full ${isMine ? "flex justify-end" : "flex justify-start"}`}
              >
                <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[80%]`}>
                  {!isMine && (
                    <div className="text-sm text-gray-600 mb-1">
                      {msg.sender}
                    </div>
                  )}
                  <div className={`flex items-end gap-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm shadow max-w-xs whitespace-pre-wrap break-words ${
                        isMine
                          ? "bg-orange-400 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap mb-0.5">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 입력창 (하단 고정) */}
        <div className="border-t bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
              placeholder="메시지를 입력하세요"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <div
              onClick={sendMessage}
              className="w-9 h-9 bg-orange-500 text-white flex items-center justify-center rounded-full hover:bg-orange-600 cursor-pointer"
            >
              <FaArrowUp className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

