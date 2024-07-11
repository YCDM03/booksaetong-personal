import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type SearchStateType = {
  search: {
    categoryList: string[];
    keyword: string;
  };
};

export type searchStoreType = {
  search: SearchStateType;
  setCategoryList: (categoryList: string[]) => void;
  setKeyword: (keyword: string) => void;
};

const useSearchStore = create<searchStoreType>(
  immer((set) => ({
    search: {
      categoryList: [],
      keyword: ''
    },
    setCategoryList: (categoryList: string[]): any =>
      set((state) => {
        state.search.categoryList = categoryList;
      }),
    setKeyword: (keyword: string): any =>
      set((state) => {
        state.search.keyword = keyword;
      })
  }))
);

export default useSearchStore;
