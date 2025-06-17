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

export interface CoffeeChatMember {
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
    writer: CoffeeChatMember;
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
    writer: CoffeeChatMember;
    isJoined: boolean;
}

export interface JoinCoffeeChatRequestDTO {
    chatNickname: string;
    profileType: "DEFAULT" | "USER";
}

export interface JoinCoffeeChatResponseDTO {
    memberId: string;
}

export interface CoffeeChatMembershipResponseDTO {
    isMember: boolean;
    userId: string | null;
    memberId: string | null;
  }
  
export interface CoffeeChatMembersResponseDTO {
    coffeeChatId: string;
    totalMemberCounts: number;
    members: CoffeeChatMember[];
}

export interface CoffeeChatReviewSummary {
    coffeeChatId: string;
    title: string;
    tags: string[];
    address: string;
    likesCount: number;
    imagesCount: number;
    previewImageUrl: string;
}

export interface CoffeeChatReviewListData {
    filter: "ALL" | "MY";
    totalReviewCount: number;
    coffeeChatReviews: CoffeeChatReviewSummary[];
}

export interface WriteCoffeeChatReviewPayload {
    memberId: string;
    text: string;
    images?: File[];
}


export interface CoffeeChatReviewDetail {
    reviewId: string;
    text: string;
    imageUrls: string[];
    writer: CoffeeChatMember;
}

export interface CoffeeChatReviewDetailData {
    coffeeChatId: string;
    title: string;
    time: string;
    tags: string[];
    address: string;
    likeCount: number;
    reviews: CoffeeChatReviewDetail[];
}

export interface CoffeeChatReviewLikeData {
    liked: boolean;
    likeCount: number;
}

export interface ChatMessage {
    messageId: string;
    content: string;
    sentAt: string;
    sender: {
        memberId: string;
        chatNickname: string;
        profileImageUrl: string;
    };
    messageType?: "TALK" | "JOIN" | "LEAVE";
}


export interface CoffeeChatMessagesResponse {
    coffeeChatId: string;
    messages: ChatMessage[];
    nextCursor: string | null;
    hasNext: boolean;
}
  
