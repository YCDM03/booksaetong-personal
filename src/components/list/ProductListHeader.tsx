import React from 'react';

function ProductListHeader({keyword, title, children}) {
  return (
    <div className={'flex flex-col gap-2'}>
      {keyword && <div className={'font-bold, text-3xl'}>{`\"${keyword}\"`} 결과 입니다.</div>}
      <div className="w-full">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 my-5 ml-[10px]">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}

export default ProductListHeader;