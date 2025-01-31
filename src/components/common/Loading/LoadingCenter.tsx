import Image from 'next/image';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image src="/images/Loading.gif" alt="Loading" width={208} height={208} unoptimized={true}/>
    </div>
  );
};

export default Loading;
