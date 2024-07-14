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

export const defaultCategoryList = [
  '경제경영',
  '만화',
  '사회과학',
  '소설/시/희곡',
  '어린이',
  '에세이',
  '유아',
  '인문학',
  '기타'
];

const useSearchStore = create<SearchStoreType>()(
  immer((set) => ({
    search: {
      categoryList: defaultCategoryList,
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
