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

export interface CoffeeChatWriter {
    memberId: string;
    chatNickname: string;
    profileImageUrl: string;
    isHost: boolean;
}

export interface CoffeeChatListItem {
    coffeChatId: string;
    title: string;
    time: string;
    maxMemberCount: number;
    currentMemberCount: number;
    tags: string[];
    address: string;
    writer: CoffeeChatWriter;
    isJoined: boolean;  
    isReviewed: boolean;   
}

export interface CoffeeChatListResponse {
    filter: string;
    coffeechats: CoffeeChatListItem[];
}
  
