import React from 'react';

function ProductListHeader({ keyword, title, address,children }) {
  return (
    <main className="md:w-full ml-10 ">
      <div className="border-b-[1px] py-5 ">
        <h1 className="text-2xl font-semibold mb-4 text-center md:text-start">{title}</h1>
        <div className={"flex"}>
        {address && <p className="text-xs text-gray-500 pr-3">{address}</p>} {keyword && <p className="text-xs text-gray-500">
           {`\"${keyword}\"`} 결과 입니다.
        </p>}
        </div>
      </div>
      {children}
    </main>
  );
}

export default ProductListHeader;