import apiClient from "@/api/apiClient";
import { useQueryClient } from '@tanstack/react-query';
import { createMutationHandler } from "@/utils/createMutationHandler";
import type { CreateCoffeeChatRequestDTO } from "@/api/coffeechat/coffeechat.dto";

// ✅ POST 요청
export const createCoffeeChat = async (data: CreateCoffeeChatRequestDTO) => {
    const response = await apiClient.post("/api/v1/coffee-chats", data);
    return response.data;
};

export const useCreateCoffeeChat = () => {
    const queryClient = useQueryClient();
  
    return createMutationHandler(createCoffeeChat, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['coffeeChats'] });
      },
    });
};

export type CoffeeChatStatus = 'ALL' | 'JOINED' | 'REVIEWABLE' | 'ENDED';
