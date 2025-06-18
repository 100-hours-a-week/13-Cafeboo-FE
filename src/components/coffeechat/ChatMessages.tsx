import { useEffect, useRef, useState } from "react";
import { useInfiniteCoffeeChatMessages } from "@/api/coffeechat/coffeechatMessageApi";
import { CoffeeChatMessagesResponse } from "@/api/coffeechat/coffeechat.dto";
import type { ChatMessage } from "@/api/coffeechat/coffeechat.dto";

interface ChatMessagesProps {
  coffeeChatId: string;
  memberId: string;
  realtimeMessages: ChatMessage[];
}

export default function ChatMessages({ coffeeChatId, memberId, realtimeMessages }: ChatMessagesProps) {
  const {
    data,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = useInfiniteCoffeeChatMessages(coffeeChatId);

  const scrollRef = useRef<HTMLDivElement>(null);
  const loadTriggerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const previousScrollHeightRef = useRef<number>(0);

  // 메시지 세팅
  useEffect(() => {
    if (!data || data.pages.length === 0) return;
  
    const lastPage = data.pages[data.pages.length - 1]; 
    const newMessages = (lastPage as CoffeeChatMessagesResponse).messages ?? [];
  
    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.messageId));
      const uniqueNew = newMessages.filter((m) => !existingIds.has(m.messageId));
      return [...uniqueNew, ...prev]; // 앞에만 추가
    });
  }, [data?.pages.length]); 

  // 실시간 메시지 병합 (중복 제거)
  useEffect(() => {
    if (realtimeMessages.length === 0) return;
    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.messageId));
      const newMessages = realtimeMessages.filter((m) => !existingIds.has(m.messageId));
      return [...prev, ...newMessages];
    });
  }, [realtimeMessages]);

  // 무한 스크롤 로딩 트리거
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const scrollTop = scrollRef.current?.scrollTop ?? 0;
        if (entry.isIntersecting && hasPreviousPage && !isFetchingPreviousPage && scrollTop <= 50) {
          previousScrollHeightRef.current = scrollRef.current?.scrollHeight || 0;
          fetchPreviousPage();
        }
      },
      {
        root: scrollRef.current,
        threshold: 1.0,
      }
    );
  
    const el = loadTriggerRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage]);

  // 과거 메시지 로딩 후 스크롤 위치 유지
  useEffect(() => {
    if (!isFetchingPreviousPage && scrollRef.current) {
      const diff = scrollRef.current.scrollHeight - previousScrollHeightRef.current;
      scrollRef.current.scrollTop += diff;
    }
  }, [data]);

  // 초기 로딩 시 맨 아래로 스크롤
  useEffect(() => {
    if (data && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [data]);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 pb-36 flex flex-col justify-end space-y-3"
    >
      <div ref={loadTriggerRef} />

      {messages.map((msg) => {
        const isMine = msg.sender.memberId === memberId;
        const isSystem = msg.messageType === "ENTER" || msg.messageType === "LEAVE";

        if (isSystem) {
          return (
            <div key={msg.messageId} className="text-center text-sm text-gray-400">
              {msg.sender.chatNickname}님이 {msg.messageType === "ENTER" ? "입장" : "퇴장"}하셨습니다.
            </div>
          );
        }

        return (
          <div key={msg.messageId} className={`w-full ${isMine ? "flex justify-end" : "flex justify-start"}`}>
            <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[80%]`}>
              {!isMine && <div className="text-sm text-gray-600 mb-1">{msg.sender.chatNickname}</div>}
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

      {isFetchingPreviousPage && (
        <div className="text-center text-gray-400 py-2 text-sm">불러오는 중...</div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}







