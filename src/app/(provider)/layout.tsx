'use client';
import Header from '@/components/common/Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

function ProvidersLayout({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <div className={"lg:ml-52 mx-auto max-w-[1440px]"}>
        {children}
      </div>

    </QueryClientProvider>
  );
}

export default ProvidersLayout;
