import { cn } from '@libs/cn';
import React from 'react';

type TabItem = { key: string; label: string };

export type UnderlineTabProps = {
  items?: TabItem[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
};

const ACTIVE_TEXT_CLASS = 'text-primary-700';
const INACTIVE_TEXT_CLASS = 'text-gray-400';
const INDICATOR_BG_CLASS = 'bg-primary-700';

const H = '4.8rem';
const PAD = '2rem';

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
    width: `calc((100% - ${PAD} - ${PAD}) / ${count})`,
    left: `calc(${PAD} + ${activeIndex} * (100% - ${PAD} - ${PAD}) / ${count})`,
    height: '0.2rem',
    borderRadius: 99,
  };

  return (
    <div
      role='tablist'
      aria-label='탐색 탭'
      className={cn(
        'sticky top-0 z-[var(--z-tabs,40)]',
        'bg-gray-white shadow-top-fixed',
        `h-[${H}]`,
        'relative w-full overflow-hidden',
        className
      )}
    >
      <div className='relative h-full' style={{ paddingLeft: PAD, paddingRight: PAD }}>
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
                className={cn(
                  'flex-row-center h-full cursor-pointer',
                  'title6',
                  active ? ACTIVE_TEXT_CLASS : INACTIVE_TEXT_CLASS
                )}
                onClick={() => onChange(t.key)}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div
          className={cn(
            'pointer-events-none absolute bottom-0 transition-all duration-200 ease-out',
            INDICATOR_BG_CLASS
          )}
          style={indicatorStyle}
          aria-hidden
        />
      </div>
    </div>
  );
}
