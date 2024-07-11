import React from 'react';

function ProductListHeader({ keyword, title, children }) {
  return (
    <>
      {keyword && <div className={'font-bold, text-3xl'}>{`\"${keyword}\"`} 결과 입니다.</div>}
          <h2 className="text-2xl font-semibold mb-4 my-5 ml-[10px]">{title}</h2>
          {children}
    </>
  );
}

export default ProductListHeader;