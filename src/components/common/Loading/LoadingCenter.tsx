import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <img src="/images/loading.gif" alt="Loading" className="w-52 h-52" />
    </div>
  );
};

export default Loading;
