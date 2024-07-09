import { cva } from 'class-variance-authority';
import { PropsWithChildren } from 'react';

interface buttonProps {
  intent: 'default' | 'login' | 'logout' | 'signUp';
}

const buttonVariant = cva('rounded-md px-4 py-2.5 text-sm hover:brightness-90 active:brightness-75', {
  variants: {
    intent: {
      default: 'bg-main text-white',
      login: 'bg-sub text-white',
      logout: 'bg-white text-sub border border-sub',
      signUp: 'bg-main text-white'
    }
  }
});

function HeaderButton({ intent, children }: PropsWithChildren<buttonProps>) {
  return <button className={buttonVariant({ intent })}>{children}</button>;
}

export default HeaderButton;
