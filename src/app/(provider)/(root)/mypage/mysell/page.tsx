'use client';
import EmptyState from '@/components/EmptyState';
import Page from '@/components/MyPage/Page';
import { useEffect, useState } from 'react';

function MySellPage() {
  const [sellData, setSellData] = useState<any[]>([]);

  useEffect(() => {
    // setSellData(판매 내역 데이터);
  }, []);

  return <Page title="판매내역">{sellData.length === 0 ? <EmptyState /> : <div>MySellPage</div>}</Page>;
}

export default MySellPage;
