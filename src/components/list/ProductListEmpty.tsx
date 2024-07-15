import EmptyState from '@/components/EmptyState';
import React from 'react';

function ProductListEmpty({ message }: { message: string }) {
  return (
    <div>
      <EmptyState empty={message} isButtonExist={false}></EmptyState>
    </div>
  );
}

export default ProductListEmpty;
