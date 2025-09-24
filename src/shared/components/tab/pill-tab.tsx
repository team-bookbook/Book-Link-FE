import { cn } from '@libs/cn';

type TabItem = { key: string; label: string };

export type PillTabProps = {
  items: TabItem[];
  value: string; // 현재 선택 key
  onChange: (key: string) => void;
  className?: string; // 컨테이너 클래스
  scrollable?: boolean;
};

const ACTIVE_BG_CLASS = 'bg-secondary-900';
const INACTIVE_TEXT_CLASS = 'text-gray-400';
const INACTIVE_BORDER_CLASS = 'border-gray-100';

export default function PillTab({ items, value, onChange, className }: PillTabProps) {
  return (
    <div
      role='tablist'
      aria-label='필터 탭'
      className={cn('w-full', 'scrollbar-hide overflow-x-auto whitespace-nowrap', 'px-[1.5rem]', className)}
    >
      <div className='py-[0.4rem]w-full flex items-center gap-[0.8rem]'>
        {items.map((it) => {
          const active = it.key === value;
          return (
            <button
              key={it.key}
              type='button'
              role='tab'
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(it.key)}
              className={cn(
                'flex-row-center',
                'rounded-[22px] px-[1.2rem] py-[0.6rem]',
                'caption2',
                'transition-colors',
                active
                  ? cn('text-gray-white', ACTIVE_BG_CLASS)
                  : cn('bg-gray-white border-[0.1rem]', INACTIVE_BORDER_CLASS, INACTIVE_TEXT_CLASS)
              )}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
