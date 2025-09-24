import { cn } from '@libs/cn';
import React from 'react';

type TabItem = { key: string; label: string };

export type UnderlineTabProps = {
  items?: TabItem[]; // 기본: 도서 / 도서관
  value: string; // 선택된 탭 key
  onChange: (key: string) => void;
  className?: string;
};

const ACTIVE_TEXT_CLASS = 'text-primary-700';
const INACTIVE_TEXT_CLASS = 'text-gray-400';
const INDICATOR_BG_CLASS = 'bg-primary-700';

export default function UnderlineTab({
  items = [
    { key: 'books', label: '도서' },
    { key: 'libraries', label: '도서관' },
  ],
  value,
  onChange,
  className,
}: UnderlineTabProps) {
  const count = items.length;
  const activeIndex = Math.max(
    0,
    items.findIndex((t) => t.key === value)
  );

  const indicatorStyle: React.CSSProperties = {
    width: `${100 / count}%`,
    left: `${(100 / count) * activeIndex}%`,
    height: '0.2rem',
    borderRadius: 99,
  };

  return (
    <div
      className={cn('bg-gray-white relative w-full overflow-hidden', 'shadow-top-fixed h-[4.8rem]', className)}
      role='tablist'
      aria-label='탐색 탭'
    >
      <div className='grid h-full' style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
        {items.map((t) => {
          const active = t.key === value;
          return (
            <button
              key={t.key}
              role='tab'
              aria-selected={active}
              aria-controls={`panel-${t.key}`}
              tabIndex={active ? 0 : -1}
              type='button'
              className={cn('flex-row-center h-full', 'title6', active ? ACTIVE_TEXT_CLASS : INACTIVE_TEXT_CLASS)}
              onClick={() => onChange(t.key)}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          'pointer-events-none absolute bottom-0 left-0 transition-all duration-200 ease-out',
          INDICATOR_BG_CLASS
        )}
        style={indicatorStyle}
        aria-hidden
      />
    </div>
  );
}
