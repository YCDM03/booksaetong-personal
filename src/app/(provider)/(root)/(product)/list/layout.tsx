import { PropsWithChildren } from 'react';

function ProvidersLayout({ children }: PropsWithChildren) {
  return <div className="flex flex-row max-w-[1200px] min-h-fit mx-auto my-10">{children}</div>;
}

export default ProvidersLayout;
