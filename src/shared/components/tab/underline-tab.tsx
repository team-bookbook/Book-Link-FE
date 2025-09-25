import { cn } from '@libs/cn';

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

const HEIGHT_CLASS = 'h-[4.8rem]';

export default function UnderlineTab({
  items = [
    { key: 'books', label: '도서' },
    { key: 'libraries', label: '도서관' },
  ],
  value,
  onChange,
  className,
}: UnderlineTabProps) {
  const activeIndex = Math.max(
    0,
    items.findIndex((t) => t.key === value)
  );
  const translateClass = activeIndex === 1 ? 'translate-x-full' : 'translate-x-0';

  return (
    <div
      role='tablist'
      aria-label='탐색 탭'
      className={cn(
        'bg-gray-white shadow-top-fixed sticky top-0 z-[var(--z-tabs,40)]',
        HEIGHT_CLASS,
        'relative w-full overflow-hidden px-[2rem]',
        className
      )}
    >
      <div className={cn('relative h-full')}>
        <div className={cn('grid h-full grid-cols-2')}>
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
                  'flex-row-center title6 h-full cursor-pointer select-none',
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
          aria-hidden
          className={cn(
            'pointer-events-none absolute bottom-0 left-0',
            'h-[0.2rem] w-1/2 rounded-full',
            INDICATOR_BG_CLASS,
            'transform',
            'transition-transform duration-200 ease-out',
            translateClass
          )}
        />
      </div>
    </div>
  );
}
