import { useMemo } from 'react';
import { cn } from '@libs/cn';
import BottomSheet from '@components/bottom-sheet/bottom-sheet';

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Props = {
  /** 바텀시트 열림 여부 */
  open: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 시트 상단 타이틀 */
  title?: string;
  /** 옵션 목록 */
  options: readonly Option[];
  /** 현재 선택 값 */
  value: string | null;
  /** 선택 변경 */
  onChange: (next: string, URL?: string) => void;
  /** 강조 배경 색상 클래스 오버라이드가 필요할 때 */
  activeBgClassName?: string;
};

export default function SelectBottomSheet({
  open,
  onClose,
  title = '',
  options,
  value,
  onChange,
  activeBgClassName = 'bg-secondary-100',
}: Props) {
  const selected = useMemo(() => options.find((o) => o.value === value) ?? null, [options, value]);

  const onPick = (v: string, disabled?: boolean) => {
    if (disabled) return;
    onChange(v);
    onClose();
  };

  return (
    <BottomSheet isOpen={open} onClose={onClose} indicatorStroke={false}>
      <div className='flex-col gap-[1.2rem] pb-[1rem]'>
        {title && (
          <h2 className='caption1 text-center text-gray-900' aria-live='polite'>
            {title}
          </h2>
        )}

        <div role='listbox' aria-activedescendant={selected ? `opt-${selected.value}` : undefined}>
          {options.map((opt) => {
            const isActive = opt.value === value;
            return (
              <button
                key={opt.value}
                id={`opt-${opt.value}`}
                type='button'
                role='option'
                aria-selected={isActive}
                disabled={opt.disabled}
                onClick={() => onPick(opt.value, opt.disabled)}
                className={cn(
                  'w-full px-[1.6rem] py-[1.8rem] text-left transition-colors',
                  isActive ? cn(activeBgClassName, 'text-gray-900') : 'bg-gray-white text-gray-900',
                  opt.disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                <span className='caption2'>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </BottomSheet>
  );
}
