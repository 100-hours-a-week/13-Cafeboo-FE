import apiClient from "@/api/apiClient";
import { ChatMessage, CoffeeChatMessagesResponse } from "@/api/coffeechat/coffeechat.dto";
import { useInfiniteQuery } from "@tanstack/react-query";

export const fetchCoffeeChatMessages = async (
    coffeeChatId: string,
    cursor: string = "0",
    limit: number = 20,
    order: "desc" | "asc" = "desc"
  ): Promise<CoffeeChatMessagesResponse> => {
    const res = await apiClient.get(`/api/v1/coffee-chats/${coffeeChatId}/messages`, {
      params: {
        cursor,
        limit,
        order,
      },
    });
  
    return res.data;
  };


  export const useInfiniteCoffeeChatMessages = (
    coffeeChatId: string,
    limit = 20,
    order: "desc" | "asc" = "desc"
  ) => {
    return useInfiniteQuery<CoffeeChatMessagesResponse>({
      queryKey: ["coffeechatMessages", coffeeChatId, order],
  
      // ✅ 초기 cursor 값 설정
      initialPageParam: "0",
  
      // ✅ 요청 함수
      queryFn: ({ pageParam }) =>
        fetchCoffeeChatMessages(coffeeChatId, pageParam as string, limit, order),
  
      // ✅ 다음 커서 설정
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.nextCursor : undefined,
  
      enabled: !!coffeeChatId,
    });
  };