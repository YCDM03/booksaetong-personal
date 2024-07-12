import React from 'react';

interface ProductIntroProps {
  contents: string;
}

const ProductIntro: React.FC<ProductIntroProps> = ({ contents }) => {
  return (
    <div className="w-full lg:w-[1000px] py-8">
      <h6 className="text-2xl font-bold my-[20px]">소개</h6>
      <p>{contents}</p>
    </div>
  );
};

export default ProductIntro;
