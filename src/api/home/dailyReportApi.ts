import apiClient from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useQueryHooks } from "@/hooks/useQueryHooks";
import { DailyCaffeineReportResponse } from "@/api/home/dailyReport.dto";

export const getDailyCaffeineReport = async (): Promise<DailyCaffeineReportResponse> => {
  const response = await apiClient.get("/api/v1/reports/daily");
  if (response.data?.data) {
    return response.data.data;
  }
  throw new Error("Invalid response format");
};

export const useDailyCaffeineReport = () => {
  const query = useQuery<DailyCaffeineReportResponse>({
        queryKey: ['dailyCaffeineReport'],
        queryFn: getDailyCaffeineReport,
        staleTime: 60000,                
        gcTime: 300000,      
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 3,              
      });
      const { showModal, setShowModal } = useQueryHooks(query);

      return {
        ...query,
        showModal,
        setShowModal,
      };
};

