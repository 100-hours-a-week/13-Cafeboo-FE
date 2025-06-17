import { useEffect, useRef } from "react";
import { useInfiniteCoffeeChatMessages } from "@/api/coffeechat/coffeechatMessageApi";
import type { ChatMessage } from "@/api/coffeechat/coffeechat.dto";

interface ChatMessagesProps {
  coffeeChatId: string;
  memberId: string;
  realtimeMessages: ChatMessage[];
}

export default function ChatMessages({ coffeeChatId, memberId, realtimeMessages }: ChatMessagesProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCoffeeChatMessages(coffeeChatId);

  const scrollRef = useRef<HTMLDivElement>(null);
  const loadTriggerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  // ✅ 무한 스크롤 (과거 내역 불러오기)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          previousScrollHeightRef.current = scrollRef.current?.scrollHeight || 0;
          fetchNextPage();
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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // ✅ 스크롤 위치 유지
  useEffect(() => {
    if (!isFetchingNextPage && scrollRef.current) {
      const diff = scrollRef.current.scrollHeight - previousScrollHeightRef.current;
      scrollRef.current.scrollTop += diff;
    }
  }, [data]);

  // ✅ 메시지 병합
  const combinedMessages = [
    ...(data?.pages.flatMap((page) => page.messages) ?? []),
    ...realtimeMessages,
  ];

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 space-y-3 pb-36 flex flex-col-reverse"
    >
      <div ref={loadTriggerRef} />

      {combinedMessages.map((msg) => {
        const type = msg.messageType ?? "TALK";

        if (type === "JOIN" || type === "LEAVE") {
          return (
            <div key={msg.messageId} className="text-center text-sm text-gray-400">
              {msg.sender.chatNickname}님이 {type === "JOIN" ? "입장" : "퇴장"}하셨습니다.
            </div>
          );
        }

        const isMine = msg.sender.memberId === memberId;

        return (
          <div
            key={msg.messageId}
            className={`w-full ${isMine ? "flex justify-end" : "flex justify-start"}`}
          >
            <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[80%]`}>
              {!isMine && (
                <div className="text-sm text-gray-600 mb-1">{msg.sender.chatNickname}</div>
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

      {isFetchingNextPage && (
        <div className="text-center text-gray-400 py-2 text-sm">불러오는 중...</div>
      )}
    </div>
  );
}





