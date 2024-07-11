import { Checkbox, CheckboxProps } from 'antd';
import React from 'react';
import useSearchStore, { searchStoreType } from '@/zustand/searchStore';

function CategoryFilter({ checkBoxOptions }: string[]) {

  const {
    search: { categoryList },
    setCategoryList
  } = useSearchStore<searchStoreType>((state) => state);

  const checkAll = checkBoxOptions.length === categoryList.length;
  const indeterminate = categoryList.length > 0 && categoryList.length < checkBoxOptions.length;

  const onChange = (list: string[]) => {
    setCategoryList(list);
  };

  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setCategoryList(e.target.checked ? checkBoxOptions : []);
  };

  return (
    <div
      className={'w-[170px] h-auto pt-[24px] pr-[24px] pl-[24px] pb-[20px] gap-[10px] flex flex-col border border-gray-300 rounded-lg'}>
      <div className={'pb-3'}>카테고리</div>
      <Checkbox className={' '} indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}> 전체</Checkbox>
      <Checkbox.Group className={'gap-[10px] t-[100px]'} options={checkBoxOptions}
                      value={categoryList}
                      onChange={onChange} />
    </div>
  );
}

export default CategoryFilter;