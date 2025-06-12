export interface CreateCoffeeChatRequestDTO {
    title: string;
    content: string;
    date: string;
    time: string;
    memberCount: number;
    tags: string[];
    location: {
      address: string;
      latitude: number;
      longitude: number;
      kakaoPlaceUrl: string;
    };
    chatNickname: string;
    profileImageType: string;
};

  
