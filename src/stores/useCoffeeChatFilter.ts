import { create } from 'zustand';

type ChatFilter = "ALL" | "JOINED" | "REVIEWABLE" | "REVIEWS";
interface CoffeeChatFilterState {
  filter: ChatFilter;
  setFilter: (filter: ChatFilter) => void;
}

export const useCoffeeChatFilter = create<CoffeeChatFilterState>((set) => ({
  filter: "ALL", 
  setFilter: (filter) => set({ filter }),
}));
