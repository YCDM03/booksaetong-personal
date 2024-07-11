import EmptyState from '@/components/EmptyState';
import React from 'react';

function ProductListEmpty() {
  return (
    <div>
      <EmptyState empty={"도서목록이"} isButtonExist={false}></EmptyState>
    </div>
  );
}

export default ProductListEmpty;