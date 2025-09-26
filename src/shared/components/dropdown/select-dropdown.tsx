import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '@libs/cn';
import Icon from '@components/icon';

type Option<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export type SelectDropdownProps<T extends string> = {
  /** 현재 값 */
  value: T;
  /** 항목 목록 */
  options: readonly Option<T>[];
  /** 선택 변경 */
  onChange: (next: T) => void;
  /** 트리거 라벨(제목형 UI에 사용) */
  triggerLabel?: string;
  /** 트리거 형태 */
  variant?: 'chip' | 'title';
  /** 메뉴 정렬 방향 */
  align?: 'start' | 'end';
  /** 메뉴 고정 너비(rem). 주지 않으면 트리거 너비에 맞춤 */
  menuWidthRem?: number;
  /** 항목 높이(rem) */
  itemHeightRem?: number;
  /** 클래스 추가 훅 */
  className?: string;
};

export default function SelectDropdown<T extends string>({
  value,
  options,
  onChange,
  triggerLabel,
  variant = 'title',
  align = 'start',
  menuWidthRem,
  itemHeightRem = 3.2,
  className = '',
}: SelectDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      options.findIndex((o) => o.value === value)
    )
  );
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(() => options.find((o) => o.value === value)?.label ?? '', [options, value]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: Event) => {
      const t = e.target as Node | null;
      if (menuRef.current && menuRef.current.contains(t)) return;
      if (triggerRef.current && triggerRef.current.contains(t)) return;
      setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener('pointerdown', onPointer, { capture: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', onPointer, { capture: true });
      window.removeEventListener('scroll', onScroll);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const idx = options.findIndex((o) => o.value === value);
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [open, options, value]);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  const onSelect = (v: T) => {
    onChange(v);
    close();
    triggerRef.current?.focus();
  };

  const onKeyDownTrigger: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => nextEnabledIndex(options, prev + 1, +1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => nextEnabledIndex(options, prev - 1, -1));
      return;
    }
  };

  const onKeyDownMenu: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      close();
      triggerRef.current?.focus();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => nextEnabledIndex(options, prev + 1, +1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => nextEnabledIndex(options, prev - 1, -1));
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const opt = options[activeIndex];
      if (opt && !opt.disabled) onSelect(opt.value);
      return;
    }
  };

  const triggerCommon = 'flex items-center gap-[0.4rem] select-none transition-colors';

  const triggerChip = 'cursor-pointer bg-gray-100 rounded-[5px] px-[0.8rem] py-[0.3rem] text-primary-900 caption5';

  const triggerTitle = 'cursor-pointer text-gray-900 body4';

  const chevronRotate = open ? 180 : 0;

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        type='button'
        ref={triggerRef}
        aria-haspopup='listbox'
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        onClick={toggle}
        onKeyDown={onKeyDownTrigger}
        className={cn(triggerCommon, variant === 'chip' ? triggerChip : triggerTitle)}
      >
        <span>{triggerLabel ?? selected}</span>
        <Icon name='dropdown' size={1.2} rotate={chevronRotate === 180 ? 180 : undefined} ariaHidden />
      </button>

      {/* Menu */}
      {open && (
        <div
          id={`${id}-menu`}
          role='listbox'
          ref={menuRef}
          tabIndex={-1}
          onKeyDown={onKeyDownMenu}
          className={cn(
            'absolute z-[var(--z-overlay)] mt-[0.8rem]',
            align === 'end' ? 'right-0' : 'left-0',
            'bg-gray-white rounded-[16px] shadow-sm',
            'outline outline-gray-200 backdrop-blur-[0.2rem]',
            menuWidthRem ? '' : 'min-w-[12rem]'
          )}
          style={menuWidthRem ? { width: `${menuWidthRem}rem` } : undefined}
        >
          <ul className='py-[0.8rem]'>
            {options.map((opt) => {
              const isSelected = opt.value === value;
              const isActive = options[activeIndex]?.value === opt.value;
              return (
                <li key={opt.value}>
                  <button
                    type='button'
                    role='option'
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onMouseEnter={() => setActiveIndex(options.findIndex((o) => o.value === opt.value))}
                    onClick={() => onSelect(opt.value)}
                    className={cn(
                      'w-full cursor-pointer px-[1.6rem] text-left',
                      'flex items-center justify-start',
                      'transition-colors',
                      opt.disabled && 'cursor-not-allowed text-gray-400',
                      !opt.disabled && (isSelected ? 'text-gray-900' : 'text-gray-400'),
                      !opt.disabled && isActive && 'bg-gray-50'
                    )}
                    style={{ height: `${itemHeightRem}rem` }}
                  >
                    <span className={cn('body5', isSelected ? 'text-gray-900' : 'text-gray-400')}>{opt.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function nextEnabledIndex<T extends string>(opts: readonly Option<T>[], start: number, step: 1 | -1): number {
  let i = start;
  const min = 0;
  const max = opts.length - 1;
  if (i < min) i = max;
  if (i > max) i = min;
  for (let k = 0; k < opts.length; k += 1) {
    const o = opts[i];
    if (!o.disabled) return i;
    i += step;
    if (i < min) i = max;
    if (i > max) i = min;
  }
  return Math.max(
    0,
    opts.findIndex((o) => !o.disabled)
  );
}
