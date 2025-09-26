import { NAV_ITEMS } from '@constants/bottom-nav';
import Icon from '@components/icon';
import { cn } from '@libs/cn';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const HIDE_THRESHOLD = 12;
const REVEAL_THRESHOLD = 8;

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(true);
  const lastPosRef = useRef(0);
  const tickingRef = useRef(false);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const contentEl = typeof document !== 'undefined' ? document.getElementById('content') : null;

    const readPos = () => (contentEl ? contentEl.scrollTop : window.scrollY);
    const onScrollTarget = contentEl ?? window;

    lastPosRef.current = readPos();

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const current = readPos();
        const delta = current - lastPosRef.current;

        if (delta > HIDE_THRESHOLD && current > 20) {
          if (visible) setVisible(false);
          lastPosRef.current = current;
        } else if (delta < -REVEAL_THRESHOLD) {
          if (!visible) setVisible(true);
          lastPosRef.current = current;
        }

        if (current <= 0 && !visible) {
          setVisible(true);
          lastPosRef.current = 0;
        }

        tickingRef.current = false;
      });
    };

    onScrollTarget.addEventListener('scroll', onScroll, { passive: true });
    return () => onScrollTarget.removeEventListener('scroll', onScroll as EventListener);
  }, [visible]);

  return (
    <div
      id='bottom-nav'
      aria-hidden={!visible}
      className={cn(
        'fixed bottom-0 left-1/2 w-full max-w-[43rem] -translate-x-1/2',
        'z-[var(--z-bottom-nav)]',
        'bg-gray-white shadow-bottom-fixed px-[1.6rem] pt-[1.2rem]',
        'pb-[2.5rem]',
        'transition-all duration-300 ease-out',
        !visible ? 'pointer-events-none translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      )}
      tabIndex={-1}
    >
      <nav className='flex-row-between' aria-label='하단 내비게이션'>
        {NAV_ITEMS.map(({ label, path, icon }) => {
          const active = isActive(path);
          return (
            <button
              key={label}
              type='button'
              className='flex-col-center h-[4.2rem] w-[6rem] cursor-pointer gap-[0.2rem]'
              onClick={() => navigate(path)}
              aria-current={active ? 'page' : undefined}
            >
              <Icon name={icon} className={active ? 'text-primary-900' : 'text-gray-400'} size={2.4} />
              <p className={cn('caption6 text-gray-400', active && 'text-primary-900')}>{label}</p>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
