import { cva } from 'class-variance-authority';
import { ComponentProps, PropsWithChildren } from 'react';

interface buttonProps extends ComponentProps<'button'> {
  intent: 'default' | 'login' | 'logout' | 'signUp';
}

const buttonVariant = cva('h-10 rounded-md px-4 py-2.5 text-sm hover:brightness-90 active:brightness-75', {
  variants: {
    intent: {
      default: 'bg-main text-white',
      login: 'bg-sub text-white',
      logout: 'bg-white text-sub border border-sub',
      signUp: 'bg-main text-white'
    }
  }
});

function HeaderButton({ intent, children, ...props }: PropsWithChildren<buttonProps>) {
  return (
    <button className={buttonVariant({ intent })} {...props}>
      {children}
    </button>
  );
}

export default HeaderButton;
