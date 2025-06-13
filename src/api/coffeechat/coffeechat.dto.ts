export interface CreateCoffeeChatRequestDTO {
    title: string;
    content: string;
    date: string;
    time: string;
    memberCount: number;
    tags: string[];
    location: CoffeeChatLocation;
    chatNickname: string;
    profileImageType: string;
};


export interface CoffeeChatLocation {
    address: string;
    latitude: number;
    longitude: number;
    kakaoPlaceUrl: string;
}

export interface CoffeeChatWriter {
    memberId: string;
    chatNickname: string;
    profileImageUrl: string;
    isHost: boolean;
}

export interface CoffeeChatListItem {
    coffeeChatId: string;
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

export interface CoffeeChatDetailResponseDTO {
    coffeeChatId: string;
    title: string;
    content: string;
    time: string;
    maxMemberCount: number;
    currentMemberCount: number;
    tags: string[];
    location: CoffeeChatLocation;
    writer: CoffeeChatWriter;
    isJoined: boolean;
}

export interface JoinCoffeeChatRequestDTO {
    chatNickname: string;
    profileType: "DEFAULT" | "USER";
}

export interface JoinCoffeeChatResponseDTO {
    memberId: string;
}
  
