import apiClient from "@/api/apiClient";
import { useQueryClient } from '@tanstack/react-query';
import { createMutationHandler } from "@/utils/createMutationHandler";
import { createQueryHandler } from "@/utils/createQueryHandler";
import type { CreateCoffeeChatRequestDTO, CoffeeChatDetailResponseDTO } from "@/api/coffeechat/coffeechat.dto";

// ✅ GET 요청 
export const fetchCoffeeChatDetail = async (coffeeChatId: string): Promise<CoffeeChatDetailResponseDTO> => {
  const response = await apiClient.get(`/api/v1/coffee-chats/${coffeeChatId}`);
  return response.data; 
};

export const useCoffeeChatDetail = (coffeeChatId: string) =>
  createQueryHandler<['coffeechatDetail', string], CoffeeChatDetailResponseDTO>(
    ['coffeechatDetail', coffeeChatId],
    () => fetchCoffeeChatDetail(coffeeChatId),
    {
      staleTime: 60000,
      gcTime: 300000,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    }
  );

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

