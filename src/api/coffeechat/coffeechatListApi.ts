import apiClient from "@/api/apiClient";
import { createQueryHandler } from '@/utils/createQueryHandler';
import type { CoffeeChatListResponse } from "@/api/coffeechat/coffeechat.dto";

export type CoffeeChatStatus = 'ALL' | 'JOINED' | 'REVIEWABLE' | 'ENDED';

// ✅ GET 요청
export const fetchCoffeeChatList = async (status: string): Promise<CoffeeChatListResponse> => {
    const response = await apiClient.get('/api/v1/coffee-chats', {
        params: { status },
      });
    return response.data;
};

export const useCoffeeChatList = (status: string) =>
    createQueryHandler<['coffeeChats', string], CoffeeChatListResponse>(
      ['coffeeChats', status],
      () => fetchCoffeeChatList(status),
      {
        staleTime: 60000,
        gcTime: 300000,
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,  
        refetchInterval: status === 'ALL' ? 100000 : false, // 20초 polling (ALL만) 
        refetchOnReconnect: true,
        retry: 1,
      }
);