import { useUserStore } from "@/stores/useUserStore";

export const getUserIdFromStore = (): string => {
  const userId = useUserStore.getState().userId;
  if (!userId) {
    throw new Error("로그인 정보가 없습니다.");
  }
  return userId;
};