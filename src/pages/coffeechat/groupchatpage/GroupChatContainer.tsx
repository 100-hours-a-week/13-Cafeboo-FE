import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useWebSocketStore } from "@/stores/webSocketStore";
import {
  useDeleteCoffeeChat,
} from "@/api/coffeechat/coffeechatApi";
import {
  useCoffeeChatMembers,
  useCoffeeChatMembership,
  useLeaveCoffeeChat,
} from "@/api/coffeechat/coffeechatMemberApi";

import GroupChatPageUI from "@/pages/coffeechat/groupchatpage/GroupChatPageUI";

interface Sender {
  memberId: string;
  chatNickname: string;
  profileImageUrl: string;
}

export interface ChatMessage {
  messageId: string;
  messageType?: "TALK" | "ENTER" | "LEAVE";
  content: string;
  sentAt: string;
  sender: Sender;
}

interface StatusProps {
  coffeechatId?: string;
  memberId?: string;
  connectionStatus: "connecting" | "connected" | "disconnected";
  realtimeMessages: ChatMessage[];
  input: string;
  inputHeight: number;
  error: any;
  members?: any;
  membership?: any;
}

interface HandlersProps {
  handleBackClick: () => void;
  setMemberId: (id: string | undefined) => void;
  setInput: (input: string) => void;
  setInputHeight: (height: number) => void;
  handleSendMessage: () => void;
  handleLeaveChat: () => void;
  handleDeleteChat: () => void;
  retryConnect: () => void;
}

export default function GroupChatContainer() {
  const { id: coffeechatId } = useParams();
  const location = useLocation();
  const state = location.state as { memberId?: string } | undefined;
  const [memberId, setMemberId] = useState<string | undefined>(state?.memberId);
  const [input, setInput] = useState("");
  const [inputHeight, setInputHeight] = useState(40);
  const { connect, disconnect, sendMessage, stompClient, error, retryConnect } = useWebSocketStore();
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);

  const navigate = useNavigate();

  const { data: membership, refetch: refetchMembership } = useCoffeeChatMembership(coffeechatId ?? "");
  const { data: members } = useCoffeeChatMembers(coffeechatId ?? "");
  const { mutateAsyncFn: leaveChat } = useLeaveCoffeeChat();
  const { mutateAsyncFn: deleteChat } = useDeleteCoffeeChat();

  // 멤버 확인 및 상태 설정
  useEffect(() => {
    if (memberId || !coffeechatId) return;
    refetchMembership()
      .then((res) => {
        const m = res.data ?? membership;
        if (!m?.isMember || !m?.memberId) {
          alert("참여자만 입장할 수 있습니다.");
          navigate(`/coffeechat/${coffeechatId}`);
          return;
        }
        setMemberId(m.memberId);
      })
      .catch(() => {
        alert("참여 정보를 확인할 수 없습니다.");
        navigate(`/coffeechat/${coffeechatId}`);
      });
  }, [coffeechatId]);

  // WebSocket 연결 관리
  useEffect(() => {
    if (!coffeechatId) return;
    setConnectionStatus("connecting");
    connect(coffeechatId);
    return () => {
      disconnect();
      setConnectionStatus("disconnected");
    };
  }, [coffeechatId, memberId]);

  // 연결 상태 감지
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

  // 메시지 구독
  useEffect(() => {
    if (!stompClient || !coffeechatId || connectionStatus !== "connected") return;

    const chatSub = stompClient.subscribe(`/topic/chatrooms/${coffeechatId}`, (msg) => {
      const chatMsg: ChatMessage = JSON.parse(msg.body);
      setRealtimeMessages((prev) => [...prev, chatMsg]);
    });

    return () => {
      chatSub.unsubscribe();
    };
  }, [stompClient, coffeechatId, connectionStatus]);

  // 채팅방 나가기
  const handleLeaveChat = async () => {
    if (!coffeechatId || !memberId) {
      alert("채팅방 정보를 찾을 수 없습니다.");
      return;
    }

    try {
        await leaveChat({ coffeechatId, memberId });

        const payload = {
            senderId: memberId,
            coffeechatId,
            message: `${membership?.chatNickname}님이 나갔습니다`,
            type: "LEAVE",
        };

        sendMessage(`/app/chatrooms/${coffeechatId}`, payload);

        navigate("/coffeechat");
    } catch (err: any) {
        alert(err?.message || "나가기 중 오류가 발생했습니다.");
    }
  };

  const handleBackClick = () => {
    navigate(`/coffeechat/${coffeechatId}`);
  };

  // 커피챗 삭제
  const handleDeleteChat = async () => {
    if (!coffeechatId) {
      alert("채팅방 정보를 찾을 수 없습니다.");
      return;
    }
    try {
      await deleteChat(coffeechatId);
      navigate("/coffeechat");
    } catch (err: any) {
      alert(err?.message || "삭제 중 오류가 발생했습니다.");
    }
  };

  // 메시지 전송
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
    setInputHeight(40);
  };

  const status: StatusProps = {
    coffeechatId,
    memberId,
    connectionStatus,
    realtimeMessages,
    input,
    inputHeight,
    error,
    members,
    membership,
  };

  const handlers: HandlersProps = {
    handleBackClick,
    setMemberId,
    setInput,
    setInputHeight,
    handleSendMessage,
    handleLeaveChat,
    handleDeleteChat,
    retryConnect,
  };

  return <GroupChatPageUI status={status} handlers={handlers} />;
}
