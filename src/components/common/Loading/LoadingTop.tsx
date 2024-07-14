import Image from 'next/image';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-start h-screen w-screen">
    <Image src="/images/loading.gif" alt="Loading" width={208} height={208} unoptimized={true}/>
    </div>
  );
};

export default Loading;
