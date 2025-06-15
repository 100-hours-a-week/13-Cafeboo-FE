import { create } from 'zustand';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

// 채팅 메시지 타입 (필요한 경우 사용)
interface ChatMessage {
  messageId: string;
  messageType: "TALK" | "JOIN" | "LEAVE";
  content: string | null;
  sentAt: string;
  sender: { userId: string; name: string; profileImageUrl: string; };
}

// WebSocket 스토어의 상태 타입 정의
interface WebSocketState {
  stompClient: Client | null;
  isConnected: boolean;
  messages: ChatMessage[]; // 전역에서 채팅 메시지를 관리할 수도 있습니다.
  currentCoffeechatId: string | null;

  // 액션 함수들
  connect: (coffeechatId: string) => void;
  disconnect: () => void;
  sendMessage: (destination: string, payload: any) => void; // 메시지 전송 함수
  addMessage: (message: ChatMessage) => void; // 메시지 추가 함수
  clearMessages: () => void; // 메시지 초기화 함수
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  stompClient: null,
  isConnected: false,
  messages: [],
  currentCoffeechatId: null, // 현재 연결된 커피챗 ID

  connect: (coffeechatId: string) => {
    const { stompClient, isConnected, currentCoffeechatId } = get();

    // 이미 연결 중이고 같은 커피챗 ID면 다시 연결하지 않음
    if (
      isConnected &&
      currentCoffeechatId === coffeechatId &&
      stompClient &&
      stompClient.connected
    ) {
      console.log('Zustand: Already connected to this coffeechat.');
      set({ isConnected: true });
      return;
    }

    // 기존 연결이 있다면 해제
    if (stompClient?.connected) {
      console.log('Zustand: Disconnecting previous connection to connect to new coffeechat.');
      stompClient.deactivate();
      set({ isConnected: false, stompClient: null, currentCoffeechatId: null });
    }

    set({ currentCoffeechatId: coffeechatId, messages: [] });
    console.log(`Zustand: Attempting to connect to WebSocket for coffeechat ${coffeechatId}...`);

    const socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL}ws`); // 또는 '/ws'

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => console.log(new Date(), str), // 디버그 로그 추가

      onConnect: (frame) => {
        console.log('Zustand: Connected: ' + frame);
        set({ isConnected: true, stompClient: client });

        // 이 스토어에서 바로 구독을 관리할 수 있습니다.
        // 하지만 구독은 해당 커피챗 ID에 따라 동적으로 이루어져야 하므로,
        // 각 채팅방 컴포넌트에서 useWebSocketStore를 이용해 직접 구독하는 것이 더 유연합니다.
        // 예를 들어: GroupChatPage의 useEffect에서 useWebSocketStore().stompClient를 가져와 구독.
      },

      onStompError: (frame) => {
        console.error('Zustand: STOMP Error:', frame);
        set({ isConnected: false, stompClient: null });
      },
      onWebSocketError: (event) => {
        console.error('Zustand: WebSocket Error:', event);
        set({ isConnected: false, stompClient: null });
      },
      onDisconnect: (frame) => {
        console.log('Zustand: Disconnected:', frame);
        set({ isConnected: false, stompClient: null, currentCoffeechatId: null });
      }
    });

    client.activate(); // 연결 시작
  },

  disconnect: () => {
    const { stompClient } = get();
    if (stompClient?.connected) {
      console.log('Zustand: Manual Disconnect initiated.');
      stompClient.deactivate();
      // deactivate()가 호출되면 onDisconnect 콜백이 실행되어 isConnected 상태가 업데이트됩니다.
    } else {
      console.log('Zustand: Not connected, no need to disconnect.');
    }
  },

  sendMessage: (destination: string, payload: any) => {
    const { stompClient } = get();
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination,
        body: JSON.stringify(payload),
      });
    } else {
      console.warn('Zustand: Cannot send message, not connected.');
      set({ isConnected: false });
    }
  },

  addMessage: (message: ChatMessage) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  }
}));