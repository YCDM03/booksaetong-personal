import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-start h-screen w-screen">
      <img src="/images/loading.gif" alt="Loading" className="w-52 h-52" />
    </div>
  );
};

export default Loading;
