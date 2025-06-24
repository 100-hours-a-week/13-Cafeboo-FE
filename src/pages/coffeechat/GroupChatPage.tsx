import PageLayout from "@/layout/PageLayout";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa6";
import { IMessage } from "@stomp/stompjs";
import { useWebSocketStore } from "@/stores/webSocketStore";
import { useDeleteCoffeeChat } from "@/api/coffeechat/coffeechatApi";
import { useCoffeeChatMembers, useCoffeeChatMembership, useLeaveCoffeeChat } from "@/api/coffeechat/coffeechatMemberApi";
import ChatMessages from "@/components/coffeechat/ChatMessages";
import { useQueryClient } from "@tanstack/react-query";

interface Sender {
  memberId: string;
  chatNickname: string;
  profileImageUrl: string;
}

interface ChatMessage {
  messageId: string;
  messageType?: "TALK" | "ENTER" | "LEAVE";
  content: string;
  sentAt: string;
  sender: Sender;
}

export default function GroupChatPage() {
  const { id: coffeechatId } = useParams();
  const location = useLocation();
  const state = location.state as { memberId?: string;} | undefined;
  const [memberId, setMemberId] = useState<string | undefined>(state?.memberId);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inputHeight, setInputHeight] = useState(40);
  const { connect, disconnect, sendMessage, stompClient } = useWebSocketStore();
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");

  const { data: membership, refetch: refetchMembership } = useCoffeeChatMembership(coffeechatId ?? "");
  const { data: members } = useCoffeeChatMembers(coffeechatId ?? "");
  const { mutateAsyncFn: leaveChat } = useLeaveCoffeeChat();
  const { mutateAsyncFn: deleteChat } = useDeleteCoffeeChat();
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);

  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        queryKey: ["coffeechatMessages", coffeechatId],
      });
    };
  }, [queryClient, coffeechatId]);

  // ✅ 멤버 확인 및 상태 설정
  useEffect(() => {
    if (memberId || !coffeechatId) return;
    refetchMembership().then((res) => {
      const m = res.data ?? membership;
      if (!m?.isMember || !m?.memberId) {
        alert("참여자만 입장할 수 있습니다.");
        navigate(`/main/coffeechat/${coffeechatId}`);
        return;
      }
      setMemberId(m.memberId);
    }).catch(() => {
      alert("참여 정보를 확인할 수 없습니다.");
      navigate(`/main/coffeechat/${coffeechatId}`);
    });
  }, [coffeechatId]);

  // ✅ WebSocket 연결 관리
  useEffect(() => {
    if (!coffeechatId) return;
    setConnectionStatus("connecting");
    connect(coffeechatId);
    return () => {
      disconnect();
      setConnectionStatus("disconnected");
    };
  }, [coffeechatId, memberId]);

  // ✅ 연결 상태 감지
  useEffect(() => {
    if (!stompClient) return;

    const onConnect = () => setConnectionStatus("connected");
    const onDisconnect = () => setConnectionStatus("disconnected");
    const onStompError = () => setConnectionStatus("disconnected");

    stompClient.onConnect = onConnect;
    stompClient.onDisconnect = onDisconnect;
    stompClient.onStompError = onStompError;

    if (stompClient.connected) {
      setConnectionStatus("connected");
    }

    return () => {
      stompClient.onConnect = () => {};
      stompClient.onDisconnect = () => {};
      stompClient.onStompError = () => {};
    };
  }, [stompClient, coffeechatId]);

  useEffect(() => {
    if (!stompClient || !coffeechatId || connectionStatus !== "connected") {
      console.log("Subscription skipped. stompClient:", !!stompClient, "coffeechatId:", !!coffeechatId, "connectionStatus:", connectionStatus);
      return;
    }

    console.log(`Attempting to subscribe to /topic/chatrooms/${coffeechatId}`);
    const subscription = stompClient.subscribe(`/topic/chatrooms/${coffeechatId}`, (msg: IMessage) => {
      const chatMsg: ChatMessage = JSON.parse(msg.body);
      console.log("💬 [받은 메시지]", chatMsg);
      setRealtimeMessages((prev) => [...prev, chatMsg]);
    });

    console.log("📡 [구독 완료]");

    return () => {
      console.log("📡 [구독 해제]");
      subscription.unsubscribe();
    };
  }, [stompClient, coffeechatId, connectionStatus]);


  // ✅ 채팅방 나가기
  const handleLeaveChat = async () => {
    if (!coffeechatId || !memberId) {
      alert("채팅방 정보를 찾을 수 없습니다.");
      return;
    }
    const payload = {
      senderId: memberId,
      coffeechatId,
      message: `${membership?.chatNickname}님이 나갔습니다`,
      type: "LEAVE",
    };

    sendMessage(`/app/chatrooms/${coffeechatId}`, payload, async () => {
      try {
        await leaveChat({ coffeechatId, memberId });
        navigate("/main/coffeechat");
      } catch (err: any) {
        alert(err?.message || "나가기 중 오류가 발생했습니다.");
      }
    });
  };

  // 커피챗 삭제하기
  const handleDeleteChat = async () => {
    if (!coffeechatId) {
      alert("채팅방 정보를 찾을 수 없습니다.");
      return;
    }
  
    try {
      await deleteChat(coffeechatId); 
      navigate("/main/coffeechat");
    } catch (err: any) {
      alert(err?.message || "삭제 중 오류가 발생했습니다.");
    }
  };


  const handleSendMessage = () => {
    if (!input.trim() || !coffeechatId || !memberId) return;
    const payload = {
      senderId: memberId,
      coffeechatId,
      message: input,
      type: "TALK",
    };
    sendMessage(`/app/chatrooms/${coffeechatId}`, payload);
    setInput("");
  
    // ✅ 높이 초기화
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <PageLayout
      headerMode="title"
      headerTitle="그룹 채팅방"
      onBackClick={() => navigate(`/main/coffeechat/${coffeechatId}`)}
      isGroupChat={true}
      chatMembers={members?.members ?? []}
      onLeaveChat={handleLeaveChat}
      onDeleteChat={handleDeleteChat}
      myMemberId={memberId ?? ""}
      nonScrollClassName={true}
      mainClassName="h-[calc(100dvh-4rem)]"
    >
      <div className="flex-1 h-full relative">
        <div className="absolute inset-0 top-0 bottom-14 p-2 bg-gray-50">
          {coffeechatId && memberId && (
            <ChatMessages
              coffeeChatId={coffeechatId}
              memberId={memberId}
              realtimeMessages={realtimeMessages}
            />
          )}
        </div>

        <div className="absolute bottom-0 left-0 w-full h-auto bg-white px-1 py-2 z-10">
          <div className="flex items-end max-w-xl mx-auto">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            placeholder="메시지를 입력하세요"
            className="flex-grow min-w-0 resize-none border border-gray-300 px-4 py-2 focus:outline-none focus:border-[#FE9400] transition-all duration-100 overflow-y-auto rounded-3xl scrollbar-hide"
            style={{ height: inputHeight }}
            onChange={(e) => {
              setInput(e.target.value);
              if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                const scrollHeight = textareaRef.current.scrollHeight;
                const maxHeight = 60;
                const newHeight = Math.min(scrollHeight, maxHeight);
                textareaRef.current.style.height = `${newHeight}px`;
                setInputHeight(newHeight);
              }
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing &&
                input.trim()
              ) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />


            <div
              onClick={handleSendMessage}
              className="ml-2 shrink-0 w-9 h-9 bg-[#FE9400] text-white flex items-center justify-center rounded-full hover:bg-[#FE9400]/80 cursor-pointer"
            >
              <FaArrowUp className="w-4 h-4" />
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}



