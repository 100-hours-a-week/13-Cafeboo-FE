import apiClient from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useQueryHooks } from "@/hooks/useQueryHooks";

export const getDailyCaffeineReport = async () => {
  const response = await apiClient.get("/api/v1/reports/daily");
  if (response.data?.data) {
    return response.data.data;
  }
  throw new Error("Invalid response format");
};

export const useDailyCaffeineReport = () => {
    const query = useQuery({
        queryKey: ['dailyCaffeineReport'],
        queryFn: getDailyCaffeineReport,
        staleTime: 300000,       
        gcTime: 600000,        
        refetchInterval: 300000,    
        refetchOnMount: true,
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

