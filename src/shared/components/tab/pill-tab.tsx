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
const INACTIVE_OUTLINE_CLASS = 'outline-offset-[-1px] outline outline-gray-100';

export default function PillTab({ items, value, onChange, className }: PillTabProps) {
  return (
    <div
      role='tablist'
      aria-label='필터 탭'
      className={cn('w-full', 'scrollbar-hide overflow-x-auto whitespace-nowrap', 'px-[2rem] py-[1rem]', className)}
    >
      <div className='flex w-full items-center gap-[0.6rem]'>
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
                'cursor-pointer rounded-[22px] px-[1.6rem] py-[0.7rem]',
                'caption2',
                'transition-colors',
                active
                  ? cn('text-gray-white', ACTIVE_BG_CLASS)
                  : cn('bg-gray-white', INACTIVE_OUTLINE_CLASS, INACTIVE_TEXT_CLASS)
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
