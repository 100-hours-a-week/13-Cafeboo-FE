import { useEffect, useRef, useState, useMemo } from "react";
import { useInfiniteCoffeeChatMessages } from "@/api/coffeechat/coffeechatMessageApi";
import { CoffeeChatMessagesResponse } from "@/api/coffeechat/coffeechat.dto";
import type { ChatMessage } from "@/api/coffeechat/coffeechat.dto";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface ChatMessagesProps {
  coffeeChatId: string;
  memberId: string;
  realtimeMessages: ChatMessage[];
}

export default function ChatMessages({
  coffeeChatId,
  memberId,
  realtimeMessages,
}: ChatMessagesProps) {
  const {
    data,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = useInfiniteCoffeeChatMessages(coffeeChatId);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const mountedRef = useRef(false);
  const initialScrolledRef = useRef(false);
  const prevScrollHeightRef = useRef<number>(0);
  const isRestoringScrollRef = useRef<boolean>(false);

  // 메시지 병합 및 정렬
  useEffect(() => {
    if (!data || data.pages.length === 0) return;

    const allMessages = data.pages.flatMap(
      (page) => (page as CoffeeChatMessagesResponse).messages ?? []
    );

    const uniqueMessages = Array.from(
      new Map(allMessages.map((m) => [m.messageId, m])).values()
    ).sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());

    setMessages(uniqueMessages);
  }, [data]);

  // 실시간 메시지 반영
  useEffect(() => {
    if (realtimeMessages.length === 0) return;

    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.messageId));
      const newMsgs = realtimeMessages.filter((m) => !existingIds.has(m.messageId));
      return [...prev, ...newMsgs];
    });
  }, [realtimeMessages]);

  // IntersectionObserver
  const { ref: loadTriggerRef } = useIntersectionObserver(
    () => {
      if (!mountedRef.current || isRestoringScrollRef.current) return;
      if (hasPreviousPage && !isFetchingPreviousPage) {
        if (scrollRef.current) {
          prevScrollHeightRef.current = scrollRef.current.scrollHeight;
          isRestoringScrollRef.current = true;
          fetchPreviousPage();
        }
      }
    },
    {
      root: scrollRef.current,
      threshold: 1.0,
    }
  );

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    if (!mountedRef.current || !scrollRef.current || !isRestoringScrollRef.current) return;

    if (prevScrollHeightRef.current > 0 && !isFetchingPreviousPage) {
      requestAnimationFrame(() => {
        if (!scrollRef.current || !isRestoringScrollRef.current) return;

        const currentScrollHeight = scrollRef.current.scrollHeight;
        const heightDifference = currentScrollHeight - prevScrollHeightRef.current;
        const currentScrollTop = scrollRef.current.scrollTop;

        if (heightDifference > 0) {
          scrollRef.current.scrollTop = currentScrollTop + heightDifference;
        }

        prevScrollHeightRef.current = 0;
        isRestoringScrollRef.current = false;
      });
    }
  }, [data, isFetchingPreviousPage]);

  // ✅ 초기 렌더링 시 맨 아래로 자동 스크롤
  useEffect(() => {
    if (!data || !bottomRef.current) return;

    if (!initialScrolledRef.current && data.pages.length >= 1) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ behavior: "auto" });
          initialScrolledRef.current = true;
        });
      }, 0);
    }
  }, [data?.pages.length]);

  // ✅ 내 메시지 오면 스크롤 아래로
  useEffect(() => {
    if (!bottomRef.current || isFetchingPreviousPage) return;

    const isMyNewMessage = realtimeMessages.some(
      (m) => m.sender.memberId === memberId
    );

    if (isMyNewMessage) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [realtimeMessages, memberId, isFetchingPreviousPage]);

  // 중복 제거된 메시지 메모이제이션
  const deduplicatedMessages = useMemo(() => {
    return Array.from(new Map(messages.map((m) => [m.messageId, m])).values());
  }, [messages]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto scrollbar-hide pb-4">
      <div className="flex flex-col justify-end min-h-full space-y-6">
        <div ref={loadTriggerRef} />

        {deduplicatedMessages.map((msg) => {
          const isMine = msg.sender.memberId === memberId;
          const isSystem = msg.messageType === "ENTER" || msg.messageType === "LEAVE";

          if (isSystem) {
            return (
              <div key={msg.messageId} className="text-center text-sm text-gray-400">
                {msg.sender.chatNickname}님이{" "}
                {msg.messageType === "ENTER" ? "입장" : "퇴장"}하셨습니다.
              </div>
            );
          }

          return (
            <div key={msg.messageId} className={`w-full ${isMine ? "flex justify-end" : "flex justify-start"}`}>
              <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[90%]`}>
                {!isMine && (
                  <div className="text-sm text-gray-600 mb-1">
                    {msg.sender.chatNickname}
                  </div>
                )}
                <div className={`flex items-end gap-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`px-4 py-2 rounded-xl text-sm shadow max-w-xs whitespace-pre-wrap break-words ${
                      isMine
                        ? "bg-[#FE9400]/90 text-white rounded-tr-xs"
                        : "bg-white text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[11px] text-gray-400 whitespace-nowrap mb-0.5">
                    {format(new Date(msg.sentAt), "a h:mm", { locale: ko })}
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
    </div>
  );
}
