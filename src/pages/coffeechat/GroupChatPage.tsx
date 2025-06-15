import PageLayout from "@/layout/PageLayout";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa6";
import { Client, IMessage } from "@stomp/stompjs";
import { useWebSocketStore } from "@/stores/webSocketStore";
import { useCoffeeChatMembership } from "@/api/coffeechat/coffeechatMemberApi";
import { CodeSquare } from "lucide-react";

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
  const { id: coffeechatId } = useParams(); 
  const location = useLocation();
  const state = location.state as { memberId?: string; } | undefined;
  const [memberId, setMemberId] = useState<string | undefined>(state?.memberId);
  const navigate = useNavigate();
  const messages = useWebSocketStore(state => state.messages);
  const isConnected = useWebSocketStore(state => state.isConnected);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const { connect, disconnect, sendMessage, addMessage, stompClient } = useWebSocketStore();
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  const { data: membership, isLoading: isMembershipLoading, isError: isMembershipError, error: membershipError, refetch: refetchMembership } = useCoffeeChatMembership(coffeechatId ?? "");

  useEffect(() => {
    if (memberId) return;
    if (!coffeechatId) return;
    refetchMembership().then((res) => {
      const m = res.data ?? membership;
      if (!m?.isMember || !m?.memberId) {
        console.log("참여자만 채팅에 입장할 수 있습니다.");
        navigate(`/main/coffeechat/${coffeechatId}`);
        return;
      }
      setMemberId(m.memberId);
    }).catch((e) => {
      console.log(e?.message || membershipError?.message || "참여 정보를 확인할 수 없습니다.");
      navigate(`/main/coffeechat/${coffeechatId}`);
    });
  }, [coffeechatId]);

  // 📡 WebSocket 연결
  // 1) 첫 번째 useEffect: 연결 관리만
  useEffect(() => {
    if (!coffeechatId) return;
    setConnectionStatus(isConnected ? "connected" : "connecting");
    connect(coffeechatId);

    return () => {
      disconnect();
      setConnectionStatus("disconnected");
    };
  }, [coffeechatId, memberId, connect, disconnect]);


  // 2) stompClient 준비되면 구독
  useEffect(() => {
    if (!stompClient || !coffeechatId || !stompClient.connected) return;
    const subscription = stompClient.subscribe(`/topic/chatrooms/${coffeechatId}`, (msg: IMessage) => {
      console.log("msg: ", msg.body); 
      const chatMsg: ChatMessage = JSON.parse(msg.body);
      console.log("💬 [서버로부터 받은 메시지]", chatMsg); 
      addMessage(chatMsg);
    });
    return () => subscription.unsubscribe();
  }, [stompClient, coffeechatId, addMessage]);

  // 연결 상태 체크(테스트용)
  useEffect(() => {
    if (!stompClient) return;

    const onConnect = () => setConnectionStatus("connected");
    const onDisconnect = () => setConnectionStatus("disconnected");
    const onStompError = () => setConnectionStatus("disconnected");

    stompClient.onConnect = onConnect;
    stompClient.onDisconnect = onDisconnect;
    stompClient.onStompError = onStompError;

    // 만약 stompClient가 이미 연결된 상태면 바로 상태 갱신
    if (stompClient.connected) {
      setConnectionStatus("connected");
    }

    return () => {
      // 해제
      stompClient.onConnect = () => {};
      stompClient.onDisconnect = () => {};
      stompClient.onStompError = () => {};
    };
  }, [stompClient]);

  // ✉️ 메시지 전송
  const handleSendMessage = () => {
    if (!input.trim() || !coffeechatId || !memberId) return;
    const payload = {
      senderId: memberId,
      coffeechatId: coffeechatId,
      message: input,
      type: "TALK"
    };
    console.log("💬 [서버로 보낸 메시지]", payload);
  
    sendMessage(`/app/chatrooms/${coffeechatId}`, payload);
    setInput("");
  };

  // 🧽 자동 스크롤
  useEffect(() => {
    chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // 📅 날짜 포맷
  const formatTime = useCallback((iso: string) =>
    new Date(iso).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: true }),
  []);

  return (
    <PageLayout
      headerMode="title"
      headerTitle="그룹 채팅방"
      onBackClick={() => navigate(`/main/coffeechat/${coffeechatId}`)}
    >
      <div className="flex flex-col h-[calc(100dvh-64px)] bg-gray-50">
        {/* 연결 상태 표시 */}
        <div className="text-center py-1 text-xs font-semibold">
          {connectionStatus === "connecting" && (
            <span className="text-yellow-600">연결 중...</span>
          )}
          {connectionStatus === "connected" && (
            <span className="text-green-600">연결됨</span>
          )}
          {connectionStatus === "disconnected" && (
            <span className="text-red-600">연결 끊김</span>
          )}
        </div>

        <div className="text-center py-2 text-sm text-gray-500">
          {new Date().toLocaleDateString("ko-KR")}
        </div>

        <div ref={chatBoxRef} className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
          {messages.map((msg) => {
            if (msg.messageType === "JOIN" || msg.messageType === "LEAVE") {
              return (
                <div key={msg.messageId} className="text-center text-sm text-gray-400">
                  {msg.sender.name}님이 {msg.messageType === "JOIN" ? "들어왔습니다." : "나갔습니다."}
                </div>
              );
            }

            const isMine = msg.sender.userId === memberId;
            return (
              <div
                key={msg.messageId}
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && input.trim()) {
                  handleSendMessage();
                }
              }}
            />
            <div
              onClick={() => handleSendMessage()}
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


