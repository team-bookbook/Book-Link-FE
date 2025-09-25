import React from 'react';
import { cn } from '@libs/cn';

type ButtonFrameProps = {
  children: React.ReactNode;
  equalize?: boolean;
  className?: string;
};

export default function ButtonFrame({ children, equalize = true, className }: ButtonFrameProps) {
  const arr = React.Children.toArray(children);
  const count = arr.length;

  const content =
    equalize && count >= 2
      ? arr.map((child, i) => (
          <div key={i} className='flex-1'>
            {child}
          </div>
        ))
      : arr;

  return (
    <div
      className={cn('shadow-bottom-fixed sticky bottom-0 z-[var(--z-bottom-nav)] bg-white', 'p-[1.6rem]', className)}
    >
      <div className={cn('flex', 'gap-[0.8rem]')}>{content}</div>
    </div>
  );
}
