export interface UserProfileResponseDTO {
  nickname: string;
  profileImageUrl: string;
  dailyCaffeineLimitMg: number;
  coffeeBean: number;
  challengeCount: number;
}

export interface UpdateUserProfilePayload {
  nickname?: string;
  profileImage?: File | null;
}
