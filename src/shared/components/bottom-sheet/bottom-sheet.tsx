import { useEffect, useRef } from 'react';
import { cn } from '@libs/cn';
import Icon from '@components/icon';
import useOutsideClick from '@components/bottom-sheet/hooks/use-outside-click';

export type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** 인디케이터 영역 하단 스트로크 표시 여부 */
  indicatorStroke?: boolean;
  /** 오버레이 클릭으로 닫기 허용 여부 */
  dismissOnOverlay?: boolean;
  /** 시트 폭 최대값(rem). 기본 43rem, 가운데 정렬 */
  maxWidthRem?: number;
};

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  indicatorStroke = false,
  dismissOnOverlay = true,
  maxWidthRem = 43,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(sheetRef, () => {
    if (isOpen) onClose();
  });

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Escape') onClose();
  };

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
        style={{ maxWidth: `${maxWidthRem}rem` }}
      >
        <div className={cn('flex-row-center', indicatorStroke && 'border-b border-gray-100')}>
          <Icon name='indicator' width={4} className='text-gray-400' ariaHidden />
        </div>

        <div className='w-full'>{children}</div>
      </div>
    </div>
  );
}
