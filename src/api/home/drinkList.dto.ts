export interface DrinkList {
  score: number;
  drink_id: number;
}

export interface DrinkIdsData {
  drink_ids: DrinkList[];  
}

export interface InnerData {
  status: string;
  data: DrinkIdsData;
}

export interface DrinkListResponse {
  status: string;
  message: string;
  data: InnerData;
}