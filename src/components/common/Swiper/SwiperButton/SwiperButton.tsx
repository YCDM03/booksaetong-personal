import { cva } from 'class-variance-authority';
import { ComponentProps, PropsWithChildren } from 'react';

interface buttonProps extends ComponentProps<'div'> {
  intent: 'default' | 'allLeft' | 'allRight' | 'areaLeft' | 'areaRight';
}

const swiperButtonVariant = cva(
  'absolute flex justify-center items-center top-1/2 transform -translate-y-1/2 z-10 cursor-pointer w-14 h-14 rounded-full bg-blue-100 hover:bg-sub active:brightness-75',
  {
    variants: {
      intent: {
        default: '',
        allLeft: 'swiper-button-prev-all-custom -left-[80px]',
        allRight: 'swiper-button-next-all-custom -right-[80px]',
        areaLeft: 'swiper-button-prev-custom -left-[80px]',
        areaRight: 'swiper-button-next-custom -right-[80px]'
      }
    }
  }
);

function SwiperButton({ intent, children }: PropsWithChildren<buttonProps>) {
  return <div className={swiperButtonVariant({ intent })}>{children}</div>;
}

export default SwiperButton;
