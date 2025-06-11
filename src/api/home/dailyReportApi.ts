import apiClient from "@/api/apiClient";
import { createQueryHandler } from "@/utils/createQueryHandler";
import { DailyCaffeineReportResponse } from "@/api/home/dailyReport.dto";

// ✅ GET 요청
const getDailyCaffeineReport = async (): Promise<DailyCaffeineReportResponse> => {
  const response = await apiClient.get("/api/v1/reports/daily");
  if (response?.data) {
    return response.data;
  }
  throw new Error("Invalid response format");
};

export const useDailyCaffeineReport = () => {
  return createQueryHandler(
    ['dailyCaffeineReport'],
    getDailyCaffeineReport,
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


