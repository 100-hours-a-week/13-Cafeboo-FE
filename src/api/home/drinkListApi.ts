import apiClient from "@/api/apiClient";
import type { DrinkListResponse } from "@/api/home/drinkList.dto";
import { createQueryHandler } from '@/utils/createQueryHandler';


export const fetchDrinkList = async (): Promise<DrinkListResponse> => {
  const response = await apiClient.get("/api/v2/drink-recommendation");
  return response.data;
};

export const useDrinkList = () => {
  return createQueryHandler(
    ['drinkList'],
    async () => {
      const response: DrinkListResponse = await fetchDrinkList();
      if (response.status === 'success') {
        return response.data.data.drink_ids;
      }
      return [];
    },
    {
      staleTime: 60000,
      gcTime: 300000,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    }
  );
};
