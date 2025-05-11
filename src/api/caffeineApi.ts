import apiClient from "@/api/apiClient";

export const recordCaffeineIntake = async (data: {
  drinkId: string;
  drinkSize: string;
  intakeTime: string;
  drinkCount: number;
  CaffeineAmount: number;
}) => {
  const response = await apiClient.post("/api/v1/caffeine-intakes", data);
  return response.data;
};
