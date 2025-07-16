import apiClient from "@/api/apiClient";
import type { UseQueryOptions } from '@tanstack/react-query';
import type { ApiResponse } from '@/types/api';
import { createQueryHandler } from "@/utils/createQueryHandler";
import { createMutationHandler } from "@/utils/createMutationHandler";
import { useQueryClient } from "@tanstack/react-query";
import type {
  CoffeeChatReviewListData,
  WriteCoffeeChatReviewPayload,
  CoffeeChatReviewDetailData,
  CoffeeChatReviewLikeData,
} from "@/api/coffeechat/coffeechat.dto";
import { useToastStore } from '@/stores/toastStore'; 

type ReviewStatus = "ALL" | "MY";

// ✅ GET 요청
export const fetchCoffeeChatReviews = async (
  status: ReviewStatus
): Promise<CoffeeChatReviewListData> => {
  const response = await apiClient.get("/api/v1/coffee-chats/reviews", {
    params: { status },
  });
  return response.data;
};

export const useCoffeeChatReviews = (
  status: ReviewStatus,
  options?: Omit<
    UseQueryOptions<
      CoffeeChatReviewListData,
      ApiResponse<null>,
      CoffeeChatReviewListData,
      ['coffeeChatReviews', ReviewStatus]
    >,
    'queryKey' | 'queryFn'
  >
) =>
  createQueryHandler(
    ["coffeeChatReviews", status],
    () => fetchCoffeeChatReviews(status),
    {
      staleTime: 0,
      gcTime: 300000,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
      ...options,
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
  const showToast = useToastStore((state) => state.showToast);
  return createMutationHandler(
    (payload: WriteCoffeeChatReviewPayload) => fetchWriteCoffeeChatReview(coffeeChatId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["coffeeChatReviews"] });
        queryClient.invalidateQueries({ queryKey: ["coffeeChatReviewDetail", coffeeChatId] });
        showToast("success", "후기가 등록되었습니다!");
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
