import apiClient from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { HealthInfo, CaffeineInfo, SleepInfo } from "@/stores/onboardingStore";

// HealthInfo + SleepInfo 전송 (Mutation)
export const useSubmitHealthInfo = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<any>,     
    Error,   
    { healthInfo: HealthInfo; sleepInfo: SleepInfo } 
  >({
    mutationFn: async ({ healthInfo, sleepInfo }: { healthInfo: HealthInfo; sleepInfo: SleepInfo }) => {
      const parsedData = {
        gender: healthInfo.gender,
        age: healthInfo.age,
        height: healthInfo.height,
        weight: healthInfo.weight,
        isPregnant: healthInfo.isPregnant || false,
        isTakingBirthPill: healthInfo.isTakingBirthPill || false,
        isSmoking: healthInfo.isSmoking || false,
        hasLiverDisease: healthInfo.hasLiverDisease || false,
        sleepTime: sleepInfo.sleepTime,
        wakeUpTime: sleepInfo.wakeUpTime,
      };

      return apiClient.post(`/api/v1/user/${userId}/health`, parsedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });;
    },
  });
};

// CaffeineInfo + SleepInfo 전송 (Mutation)
export const useSubmitCaffeineInfo = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    AxiosResponse<any>,       // 성공 시 응답 타입
    Error,                    // 에러 타입
    { caffeineInfo: CaffeineInfo; sleepInfo: SleepInfo } // 변수 타입
  >({
    mutationFn: async ({ caffeineInfo, sleepInfo }: { caffeineInfo: CaffeineInfo; sleepInfo: SleepInfo }) => {
      const parsedData = {
        caffeineSensitivity: caffeineInfo.caffeineSensitivity,
        averageDailyCaffeineIntake: caffeineInfo.averageDailyCaffeineIntake,
        frequentDrinkTime: sleepInfo.frequentDrinkTime || "00:00",
        userFavoriteDrinks: caffeineInfo.userFavoriteDrinks || [],
      };

      return apiClient.post(`/api/v1/user/${userId}/caffeine`, parsedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });;
    },
  });
};




