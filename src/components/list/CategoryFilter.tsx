import { Checkbox, CheckboxProps } from 'antd';
import React from 'react';
import useSearchStore, { SearchStoreType } from '@/zustand/searchStore';

type CategoryFilterType = {
  checkBoxOptions: string[];
  showFilter: boolean;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
};

function CategoryFilter({ checkBoxOptions, showFilter, setShowFilter }: CategoryFilterType) {
  const {
    search: { categoryList },
    setCategoryList
  } = useSearchStore<SearchStoreType>((state) => state);

  const checkAll = checkBoxOptions.length === categoryList.length;
  const indeterminate = categoryList.length > 0 && categoryList.length < checkBoxOptions.length;

  const onChange = (list: string[]) => {
    setCategoryList(list);
  };

  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setCategoryList(e.target.checked ? checkBoxOptions : []);
  };

  return (
    <div className="relative w-[430px] sm:w-[200px] px-[24px] py-[24px] border border-gray-300 rounded-lg">
      <div className="absolute top-2 right-2 sm:hidden">
        <button className=" text-2xl" onClick={() => setShowFilter(!showFilter)}>
          X
        </button>
      </div>
      <Checkbox className="pb-2" indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        {' '}
        전체
      </Checkbox>
      <Checkbox.Group
        className="gap-[10px] flex flex-row sm:flex-col"
        options={checkBoxOptions}
        value={categoryList}
        onChange={onChange}
      />
    </div>
  );
}

export default CategoryFilter;
