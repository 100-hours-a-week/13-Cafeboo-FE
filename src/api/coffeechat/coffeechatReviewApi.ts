import apiClient from "@/api/apiClient";
import { createQueryHandler } from "@/utils/createQueryHandler";
import { createMutationHandler } from "@/utils/createMutationHandler";
import { useQueryClient } from "@tanstack/react-query";
import type {
  CoffeeChatReviewListData,
  WriteCoffeeChatReviewPayload,
  CoffeeChatReviewDetailData,
  CoffeeChatReviewLikeData,
} from "@/api/coffeechat/coffeechat.dto";

// ✅ GET 요청
export const fetchCoffeeChatReviews = async (
  status: "ALL" | "MY"
): Promise<CoffeeChatReviewListData> => {
  const response = await apiClient.get("/api/v1/coffee-chats/reviews", {
    params: { status },
  });
  return response.data;
};

export const useCoffeeChatReviews = (status: "ALL" | "MY") =>
  createQueryHandler(
    ["coffeeChatReviews", status],
    () => fetchCoffeeChatReviews(status),
    {
      staleTime: 60000,
      gcTime: 300000,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    }
  );

// ✅ GET 요청
export const fetchCoffeeChatReviewDetail = async (
    coffeeChatId: string
  ): Promise<CoffeeChatReviewDetailData> => {
    const response = await apiClient.get(`/api/v1/coffee-chats/reviews/${coffeeChatId}`);
    return response.data;
  };
  
  export const useCoffeeChatReviewDetail = (coffeeChatId: string) =>
    createQueryHandler(
      ["coffeeChatReviewDetail", coffeeChatId],
      () => fetchCoffeeChatReviewDetail(coffeeChatId),
      {
        staleTime: 60000,
        gcTime: 300000,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 1,
      }
    );

// ✅ POST 요청
export const fetchWriteCoffeeChatReview = async (
  coffeeChatId: string,
  payload: WriteCoffeeChatReviewPayload
): Promise<void> => {
  const formData = new FormData();
  formData.append("memberId", payload.memberId);
  formData.append("text", payload.text);
  if (payload.images) {
    payload.images.forEach((img) => formData.append("images", img));
  }
  await apiClient.post(
    `/api/v1/coffee-chats/reviews/${coffeeChatId}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
};

export const useWriteCoffeeChatReview = (coffeeChatId: string) => {
  const queryClient = useQueryClient();
  return createMutationHandler(
    (payload: WriteCoffeeChatReviewPayload) => fetchWriteCoffeeChatReview(coffeeChatId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["coffeeChatReviews"] });
        queryClient.invalidateQueries({ queryKey: ["coffeeChatReviewDetail", coffeeChatId] });
      },
    }
  );
};

// ✅ POST 요청
export const fetchLikeCoffeeChatReview = async (
  coffeeChatId: string
): Promise<CoffeeChatReviewLikeData> => {
  const response = await apiClient.post(`/api/v1/coffee-chats/reviews/${coffeeChatId}/likes`);
  return response.data;
};

export const useLikeCoffeeChatReview = (coffeeChatId: string) => {
  const queryClient = useQueryClient();
  return createMutationHandler(
    () => fetchLikeCoffeeChatReview(coffeeChatId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["coffeeChatReviews"], exact: false });
        queryClient.invalidateQueries({ queryKey: ["coffeeChatReviewDetail", coffeeChatId] });
      },
    }
  );
};
