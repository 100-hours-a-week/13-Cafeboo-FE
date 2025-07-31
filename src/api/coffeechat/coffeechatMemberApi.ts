import apiClient from '@/api/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import { createMutationHandler } from '@/utils/createMutationHandler';
import { createQueryHandler } from '@/utils/createQueryHandler';
import {
  JoinCoffeeChatRequestDTO,
  JoinCoffeeChatResponseDTO,
  CoffeeChatMembershipResponseDTO,
  CoffeeChatMembersResponseDTO,
} from '@/api/coffeechat/coffeechat.dto';

// ✅ GET 요청
export const fetchCoffeeChatMembership = async (
  coffeeChatId: string
): Promise<CoffeeChatMembershipResponseDTO> => {
  const response = await apiClient.get(
    `/api/v1/coffee-chats/${coffeeChatId}/membership`
  );
  return response.data;
};

export const useCoffeeChatMembership = (coffeeChatId: string) =>
  createQueryHandler(
    ['coffeeChatMembership', coffeeChatId],
    () => fetchCoffeeChatMembership(coffeeChatId),
    {
      staleTime: 60000,
      gcTime: 300000,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    }
  );

// ✅ GET 요청
export const fetchCoffeeChatMembers = async (
  coffeeChatId: string
): Promise<CoffeeChatMembersResponseDTO> => {
  const response = await apiClient.get(
    `/api/v1/coffee-chats/${coffeeChatId}/members`
  );
  return response.data;
};

export const useCoffeeChatMembers = (coffeeChatId: string) =>
  createQueryHandler(
    ['coffeeChatMembers', coffeeChatId],
    () => fetchCoffeeChatMembers(coffeeChatId),
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
export const fetchJoinCoffeeChat = async (
  coffeeChatId: string,
  data: JoinCoffeeChatRequestDTO
): Promise<JoinCoffeeChatResponseDTO> => {
  const response = await apiClient.post(
    `/api/v1/coffee-chats/${coffeeChatId}/members`,
    data
  );
  return response.data;
};

export const useJoinCoffeeChat = (coffeeChatId: string) => {
  const queryClient = useQueryClient();

  return createMutationHandler(
    (data: JoinCoffeeChatRequestDTO) => fetchJoinCoffeeChat(coffeeChatId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['coffeeChats'] });
        queryClient.invalidateQueries({
          queryKey: ['coffeeChatDetail', coffeeChatId],
        });
      },
    }
  );
};

// ✅ POST 요청
export const fetchJoinCoffeeChatListener = async (
  coffeeChatId: string
): Promise<void> => {
  await apiClient.post(`/api/v1/coffee-chats/${coffeeChatId}/listeners`);
};

export const useJoinCoffeeChatListener = (coffeeChatId: string) => {
  const queryClient = useQueryClient();

  return createMutationHandler(
    () => fetchJoinCoffeeChatListener(coffeeChatId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['coffeeChats'] });
        queryClient.invalidateQueries({
          queryKey: ['coffeeChatDetail', coffeeChatId],
        });
      },
    }
  );
};

// ✅ DELETE 요청
export const fetchLeaveCoffeeChat = async (
  coffeechatId: string,
  memberId: string
): Promise<void> => {
  await apiClient.delete(
    `/api/v1/coffee-chats/${coffeechatId}/members/${memberId}`
  );
};

export const useLeaveCoffeeChat = () => {
  const queryClient = useQueryClient();

  return createMutationHandler(
    ({ coffeechatId, memberId }: { coffeechatId: string; memberId: string }) =>
      fetchLeaveCoffeeChat(coffeechatId, memberId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['coffeeChats'] });
      },
    }
  );
};
