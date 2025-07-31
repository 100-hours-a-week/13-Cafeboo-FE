import { create } from 'zustand';

type ReviewFilter = 'ALL' | 'MY';

interface ReviewTabState {
  filter: ReviewFilter;
  setFilter: (f: ReviewFilter) => void;
}

export const useReviewTabStore = create<ReviewTabState>((set) => ({
  filter: 'ALL',
  setFilter: (f) => set({ filter: f }),
}));
