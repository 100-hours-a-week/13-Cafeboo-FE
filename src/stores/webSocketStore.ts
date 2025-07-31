import { create } from 'zustand';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { useToastStore } from '@/stores/toastStore';

interface ChatMessage {
  messageId: string;
  messageType?: 'TALK' | 'JOIN' | 'LEAVE';
  content: string | null;
  sentAt: string;
  sender: { memberId: string; chatNickname: string; profileImageUrl: string };
}

interface WebSocketState {
  stompClient: Client | null;
  isConnected: boolean;
  error: string | null;
  messages: ChatMessage[];
  currentCoffeechatId: string | null;

  connect: (coffeechatId: string, onConnected?: () => void) => void;
  disconnect: () => void;
  retryConnect: () => void;
  sendMessage: (destination: string, payload: any, onSent?: () => void) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  stompClient: null,
  isConnected: false,
  error: null,
  messages: [],
  currentCoffeechatId: null,

  connect: (coffeechatId: string, onConnected?: () => void) => {
    const { stompClient, isConnected, currentCoffeechatId } = get();

    if (
      isConnected &&
      currentCoffeechatId === coffeechatId &&
      stompClient &&
      stompClient.connected
    ) {
      console.log('Zustand: Already connected to this coffeechat.');
      set({ isConnected: true, error: null });
      return;
    }

    if (stompClient?.connected) {
      console.log(
        'Zustand: Disconnecting previous connection to connect to new coffeechat.'
      );
      stompClient.deactivate();
      set({ isConnected: false, stompClient: null, currentCoffeechatId: null });
    }

    set({ currentCoffeechatId: coffeechatId, messages: [], error: null });

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_API_BASE_URL}ws`),
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 10000,

      onConnect: (frame) => {
        set({ isConnected: true, stompClient: client, error: null });
        const toastStore = useToastStore;
        client.subscribe('/user/queue/errors', (msg: IMessage) => {
          console.warn('⚠️ Zustand STOMP Error:', msg.body);
          toastStore
            .getState()
            .showToast(
              'error',
              '부적절한 표현이 감지되어 메시지를 전송할 수 없습니다.'
            );
        });

        if (onConnected) onConnected();
      },

      onStompError: (frame) => {
        console.error('Zustand: STOMP Error:', frame);
        set({
          isConnected: false,
          stompClient: null,
          error: 'STOMP 연결 오류가 발생했습니다.',
        });
      },

      onWebSocketError: (event) => {
        console.error('Zustand: WebSocket Error:', event);
        set({
          isConnected: false,
          stompClient: null,
          error: '서버와의 연결이 끊어졌습니다.',
        });
      },

      onDisconnect: (frame) => {
        set({
          isConnected: false,
          stompClient: null,
          currentCoffeechatId: null,
          error: 'WebSocket 연결이 끊어졌습니다.',
        });
      },
    });

    // ✅ 직접 연결 종료도 감지
    client.onWebSocketClose = () => {
      set({
        isConnected: false,
        stompClient: null,
        currentCoffeechatId: null,
        error: 'WebSocket 연결이 닫혔습니다.',
      });
    };

    client.activate();
  },

  disconnect: () => {
    const { stompClient } = get();
    if (stompClient?.connected) {
      stompClient.deactivate();
      set({
        isConnected: false,
        stompClient: null,
        currentCoffeechatId: null,
        error: 'WebSocket 연결이 종료되었습니다.',
      });
    } else {
      console.log('Zustand: Not connected, no need to disconnect.');
    }
  },

  retryConnect: () => {
    window.location.reload();
  },

  sendMessage: (destination: string, payload: any, onSent?: () => void) => {
    const { stompClient, isConnected } = get();
    if (!stompClient || !isConnected || !stompClient.connected) {
      console.warn(
        '❌ Zustand: Cannot send message — WebSocket not connected.'
      );
      return;
    }

    stompClient.publish({
      destination,
      body: JSON.stringify(payload),
    });

    if (onSent) {
      setTimeout(() => {
        onSent();
      }, 200);
    }
  },

  addMessage: (message: ChatMessage) => {
    set((state) => {
      if (state.messages.find((m) => m.messageId === message.messageId)) {
        return state;
      }
      return {
        messages: [...state.messages, message],
      };
    });
  },
  clearMessages: () => {
    set({ messages: [] });
  },
}));
