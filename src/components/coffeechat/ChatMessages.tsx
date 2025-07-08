import { useEffect, useRef, useState, useMemo } from "react";
import { useInfiniteCoffeeChatMessages } from "@/api/coffeechat/coffeechatMessageApi";
import { CoffeeChatMessagesResponse } from "@/api/coffeechat/coffeechat.dto";
import type { ChatMessage } from "@/api/coffeechat/coffeechat.dto";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { formatTimeToKorean } from "@/utils/formatUtils";
import MemberImage from "../common/MemberImage";

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
    if ((!data || data.pages.length === 0) && realtimeMessages.length === 0) {
      setMessages([]);
      return;
    }
  
    // API에서 불러온 메시지들
    const apiMessages = data
      ? data.pages.flatMap((page) => (page as CoffeeChatMessagesResponse).messages ?? [])
      : [];
  
    // 실시간 메시지와 합치기
    const combinedMessages = [...apiMessages, ...realtimeMessages];
  
    // 중복 제거 및 정렬
    const uniqueSortedMessages = Array.from(
      new Map(combinedMessages.map((m) => [m.messageId, m])).values()
    ).sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  
    setMessages(uniqueSortedMessages);
  }, [data, realtimeMessages]);

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

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto scrollbar-hide pb-4">
      <div className="flex flex-col justify-end min-h-full space-y-6">
        {isFetchingPreviousPage && (
          <div className="text-center text-gray-400 py-2 text-sm">불러오는 중...</div>
        )}

        <div ref={loadTriggerRef} />

        {messages.map((msg) => {
          const isMine = msg.sender.memberId === memberId;
          const isSystem = msg.messageType === "ENTER" || msg.messageType === "LEAVE";

          if (isSystem) {
            return (
              <div
              key={msg.messageId}
              className="
                mx-auto mt-2 mb-4 inline-block
                rounded-full bg-gray-200 px-4 py-1
                text-center text-sm  text-gray-500
                select-none
                "
              style={{ maxWidth: '60%', userSelect: 'none' }}
            >
              {msg.content}
            </div>
            );
          }

          return (
            <div
              key={msg.messageId}
              className={`flex ${isMine ? "justify-end" : "justify-start"} items-start`}
            >
              {/* 상대방 메시지일 경우: 프로필 이미지 */}
              {!isMine && (
                <MemberImage
                  url={msg.sender.profileImageUrl}
                  alt={msg.sender.chatNickname}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
          
              <div className={`flex flex-col ${isMine ? "items-end max-w-[90%] " : "items-start max-w-[80%]"}`}>
                {/* 상대방일 경우 닉네임 표시 */}
                {!isMine && (
                  <div className="text-xs mb-1">{msg.sender.chatNickname}</div>
                )}
          
                {/* 말풍선 + 시간 (inline 정렬) */}
                <div className={`flex items-end gap-1.5 ${isMine ? "flex-row-reverse" : ""}`}>
                  {/* 말풍선 */}
                  <div
                    className={`px-4 py-2 rounded-xl text-sm shadow max-w-xs whitespace-pre-wrap break-words ${
                      isMine
                        ? "bg-[#FE9400]/80 text-white rounded-tr-xs"
                        : "bg-white text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
          
                  {/* 시간 */}
                  <div className="text-[10px] text-[#595959] mb-0.5 min-w-[36px] shrink-0">
                      {formatTimeToKorean(msg.sentAt)}
                  </div>
                </div>
              </div>
            </div>
          );
          
        })}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
