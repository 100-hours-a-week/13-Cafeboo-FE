import apiClient from "@/api/apiClient";
import { useQueryClient } from '@tanstack/react-query';
import { createMutationHandler } from '@/utils/createMutationHandler';
import { JoinCoffeeChatRequestDTO, JoinCoffeeChatResponseDTO } from "@/api/coffeechat/coffeechat.dto";

export const fetchJoinCoffeeChat = async (
    coffeeChatId: string,
    data: JoinCoffeeChatRequestDTO
): Promise<JoinCoffeeChatResponseDTO> => {
    const response = await apiClient.post(`/api/v1/coffee-chats/${coffeeChatId}/members`, data);
    return response.data; 
};

export const useJoinCoffeeChat = (coffeeChatId: string) => {
    const queryClient = useQueryClient();
  
    return createMutationHandler(
      (data: JoinCoffeeChatRequestDTO) => fetchJoinCoffeeChat(coffeeChatId, data),
      {
        onSuccess: () => {
          // 성공 시 참여 리스트(또는 해당 커피챗 상세) refetch
          queryClient.invalidateQueries({ queryKey: ['coffeeChats'] });
          queryClient.invalidateQueries({ queryKey: ['coffeeChatDetail', coffeeChatId] });
        },
      }
    );
};