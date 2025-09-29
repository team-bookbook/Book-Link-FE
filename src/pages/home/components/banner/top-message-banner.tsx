import { useEffect, useRef, useState } from 'react';
import { cn } from '@libs/cn';

interface TopMessageBannerProps {
  message?: string;
  threshold?: number;
}

export default function TopMessageBanner({ threshold = 300 }: TopMessageBannerProps) {
  const [visible, setVisible] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    const contentEl = typeof document !== 'undefined' ? document.getElementById('content') : null;

    const readPos = () => (contentEl ? contentEl.scrollTop : window.scrollY);
    const onScrollTarget = contentEl ?? window;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const current = readPos();

        if (current >= threshold) {
          if (!visible) setVisible(true);
        } else {
          if (visible) setVisible(false);
        }

        tickingRef.current = false;
      });
    };

    onScrollTarget.addEventListener('scroll', onScroll, { passive: true });
    return () => onScrollTarget.removeEventListener('scroll', onScroll as EventListener);
  }, [visible, threshold]);

  return (
    <>
      <div
        aria-hidden={!visible}
        className={cn(
          'fixed top-[6rem] left-1/2 min-h-[4.5rem] w-full max-w-[43rem] -translate-x-1/2 bg-[#FAEAEA]',
          'z-1',
          'px-[1.6rem] py-[1.2rem]',
          'transition-all duration-300 ease-out',
          !visible ? 'pointer-events-none -translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        )}
        tabIndex={-1}
      >
        <div className='flex-row-center'>
          <p className='text-system-error body5'>
            <span className='button4'>모순</span> 도서 반납까지 D-1 남았어요!
          </p>
        </div>
      </div>
    </>
  );
}
