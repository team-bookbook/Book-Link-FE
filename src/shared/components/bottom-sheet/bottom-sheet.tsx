import { useEffect, useRef, useState } from 'react';
import { cn } from '@libs/cn';
import Icon from '@components/icon';
import useOutsideClick from '@components/bottom-sheet/hooks/use-outside-click';

export type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  indicatorStroke?: boolean;
  dismissOnOverlay?: boolean;
  maxWidthRem?: number;
  draggable?: boolean;
  dragHandleOnly?: boolean;
  dragCloseThresholdPx?: number;
};

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  indicatorStroke = false,
  dismissOnOverlay = true,
  maxWidthRem = 43,
  draggable = false,
  dragHandleOnly = false,
  dragCloseThresholdPx = 120,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);

  const [vvh, setVvh] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 0);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    const updateVvh = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      setVvh(h);
      document.documentElement.style.setProperty('--vvh', `${h}px`);
    };
    updateVvh();
    window.visualViewport?.addEventListener('resize', updateVvh);
    window.addEventListener('orientationchange', updateVvh);
    return () => {
      window.visualViewport?.removeEventListener('resize', updateVvh);
      window.removeEventListener('orientationchange', updateVvh);
    };
  }, []);

  useOutsideClick(sheetRef, () => {
    if (!dismissOnOverlay) return;
    if (isOpen) onClose();
  });

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Escape') onClose();
  };

  const startY = useRef(0);
  const currentY = useRef(0);
  const animatingBack = useRef(false);

  const setTranslate = (y: number) => {
    if (!sheetRef.current) return;
    sheetRef.current.style.transform = `translateY(${y}px)`;
  };

  const resetTranslate = () => {
    animatingBack.current = true;
    if (!sheetRef.current) return;
    sheetRef.current.style.transition = 'transform 200ms ease-out';
    sheetRef.current.style.transform = 'translateY(0px)';
    const done = () => {
      animatingBack.current = false;
      if (sheetRef.current) sheetRef.current.style.transition = '';
      sheetRef.current?.removeEventListener('transitionend', done);
    };
    sheetRef.current?.addEventListener('transitionend', done);
  };

  useEffect(() => {
    if (!draggable || !isOpen) return;

    const target = dragHandleOnly ? handleRef.current : sheetRef.current;
    if (!target) return;

    const onPointerDown = (e: PointerEvent) => {
      const scroller = sheetRef.current?.querySelector('[data-sheet-scroller]');
      if (scroller instanceof HTMLElement && scroller.scrollTop > 0) return;

      startY.current = e.clientY;
      currentY.current = 0;
      if (e.target instanceof Element) {
        e.target.setPointerCapture?.(e.pointerId);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (startY.current === 0 || animatingBack.current) return;
      const dy = e.clientY - startY.current;
      currentY.current = Math.max(dy, 0);
      setTranslate(currentY.current);
    };

    const onPointerUp = () => {
      if (startY.current === 0) return;
      const shouldClose = currentY.current > dragCloseThresholdPx;
      startY.current = 0;
      currentY.current = 0;
      if (shouldClose) onClose();
      else resetTranslate();
    };

    target.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      target.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [draggable, dragHandleOnly, isOpen, onClose, dragCloseThresholdPx]);

  return (
    <div
      aria-hidden={!isOpen}
      aria-modal='true'
      role='dialog'
      onKeyDown={onKeyDown}
      className={cn('fixed inset-0 z-[var(--z-modal)]', isOpen ? 'pointer-events-auto' : 'pointer-events-none')}
    >
      <div
        className={cn(
          'bg-opacity-light absolute inset-0 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={() => {
          if (dismissOnOverlay) onClose();
        }}
      />

      <div
        ref={sheetRef}
        className={cn(
          'absolute inset-x-0 bottom-0 mx-auto w-full',
          'transition-transform duration-300 ease-out',
          'bg-gray-white rounded-t-[12px] shadow-md',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{
          maxWidth: `${maxWidthRem}rem`,
          maxHeight: `min(80vh, var(--vvh, ${vvh}px))`,
          paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
        }}
      >
        <div
          ref={handleRef}
          className={cn(
            'flex-row-center touch-none select-none',
            indicatorStroke && 'border-b border-gray-100',
            draggable ? 'cursor-grab active:cursor-grabbing' : ''
          )}
        >
          <Icon name='indicator' width={4} className='text-gray-400' ariaHidden />
        </div>

        <div className='w-full' data-sheet-scroller>
          {children}
        </div>
      </div>
    </div>
  );
}
