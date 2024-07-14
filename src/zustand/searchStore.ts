import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type SearchType = {
  categoryList: string[];
  keyword: string;
};

export type SearchStoreType = {
  search: SearchType;
  setCategoryList: (categoryList: string[]) => void;
  setKeyword: (keyword: string) => void;
};

const useSearchStore = create<SearchStoreType>()(
  immer((set) => ({
    search: {
      categoryList: [],
      keyword: ''
    },
    setCategoryList: (categoryList: string[]) =>
      set((state) => {
        state.search.categoryList = categoryList;
      }),
    setKeyword: (keyword: string) =>
      set((state) => {
        state.search.keyword = keyword;
      })
  }))
);

export default useSearchStore;
