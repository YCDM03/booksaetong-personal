import { cva } from 'class-variance-authority';
import { PropsWithChildren } from 'react';

interface buttonProps {
  intent: 'default' | 'login' | 'logout' | 'signUp';
}

const buttonVariant = cva('px-3 py-1', {
  variants: {
    intent: {
      default: '',
      login: '',
      logout: '',
      signUp: ''
    }
  }
});

function HeaderButton({ intent, children }: PropsWithChildren<buttonProps>) {
  return <button className={buttonVariant({ intent })}>{children}</button>;
}

export default HeaderButton;
