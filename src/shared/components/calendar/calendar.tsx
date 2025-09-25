import { useMemo, useState, useCallback, useEffect } from 'react';
import Icon from '@components/icon';
import { cn } from '@libs/cn';

type MarkerTone = 'info' | 'warning' | 'success' | 'error' | 'primary';
type Marker = { date: string; tone?: MarkerTone };

type CalendarProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  markers?: Marker[];
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  prevIconName?: string;
  nextIconName?: string;
};

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}
function toKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function addMonths(base: Date, delta: number): Date {
  const next = new Date(base.getFullYear(), base.getMonth() + delta, 1);
  const last = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(base.getDate(), last));
  return next;
}
function startOfCalendarGrid(d: Date): Date {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return new Date(start.getFullYear(), start.getMonth(), start.getDate());
}
function buildGrid(view: Date): Date[] {
  const start = startOfCalendarGrid(view);
  const arr: Date[] = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    arr.push(d);
  }
  return arr;
}
function inRange(d: Date, min?: Date, max?: Date): boolean {
  if (min && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return false;
  if (max && d > new Date(max.getFullYear(), max.getMonth(), max.getDate())) return false;
  return true;
}
function toneBg(tone?: MarkerTone): string {
  switch (tone) {
    case 'warning':
      return 'bg-system-warning';
    case 'success':
      return 'bg-system-success';
    case 'error':
      return 'bg-system-error';
    case 'primary':
      return 'bg-primary-700';
    default:
      return 'bg-system-info';
  }
}
function sameDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function Calendar({
  value,
  onChange,
  markers,
  className = '',
  minDate,
  maxDate,
  prevIconName = 'arrow',
  nextIconName = 'arrow',
}: CalendarProps) {
  const initial = value ?? new Date();
  const [view, setView] = useState(() => new Date(initial.getFullYear(), initial.getMonth(), 1));

  const [innerSelected, setInnerSelected] = useState<Date | null>(value ?? null);
  useEffect(() => {
    if (value) setInnerSelected(value);
  }, [value]);

  const grid = useMemo(() => buildGrid(view), [view]);
  const monthIdx = view.getMonth();
  const selected = value ?? innerSelected ?? null;
  const selectedKey = selected ? toKey(selected) : '';

  const markerMap = useMemo(() => {
    const m: Record<string, MarkerTone> = {};
    markers?.forEach((x) => {
      m[x.date] = x.tone ?? 'info';
    });
    return m;
  }, [markers]);

  const headerLabel = `${view.getFullYear()}.${pad2(view.getMonth() + 1)}`;
  const weeks = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();

  const prev = useCallback(() => setView((v) => addMonths(v, -1)), []);
  const next = useCallback(() => setView((v) => addMonths(v, +1)), []);
  const choose = useCallback(
    (d: Date) => {
      if (!inRange(d, minDate, maxDate)) return;
      onChange?.(d);
      if (value === undefined) setInnerSelected(d);
    },
    [minDate, maxDate, onChange, value]
  );

  return (
    <div
      className={cn(
        'w-full',
        'px-[0.5rem] pt-[1.5rem] pb-[1.5rem]',
        'bg-gray-white',
        'rounded-[10px]',
        'outline outline-offset-[-1px] outline-gray-200',
        'flex flex-col items-center gap-[1.2rem]',
        className
      )}
      role='group'
      aria-label='달력'
    >
      <div className='inline-flex items-center justify-center gap-[2.4rem]'>
        <button
          type='button'
          aria-label='이전 달'
          onClick={prev}
          className='flex h-[3.2rem] w-[3.2rem] cursor-pointer items-center justify-center rounded-[12px]'
        >
          <Icon name={prevIconName} size={1.8} ariaHidden />
        </button>

        <span className='body2 text-gray-900'>{headerLabel}</span>

        <button
          type='button'
          aria-label='다음 달'
          onClick={next}
          className='flex h-[3.2rem] w-[3.2rem] cursor-pointer items-center justify-center rounded-[12px]'
        >
          <Icon name={nextIconName} rotate={180} size={1.8} ariaHidden />
        </button>
      </div>

      <div className='grid w-full grid-cols-7 gap-[0.4rem]'>
        {weeks.map((w) => {
          const color = w === '일' ? 'text-system-error' : w === '토' ? 'text-system-success' : 'text-gray-900';
          return (
            <div
              key={`w-${w}`}
              className='flex h-[4.8rem] w-[4.8rem] flex-col items-center justify-center rounded-[8px]'
            >
              <span className={['caption3', color].join(' ')}>{w}</span>
            </div>
          );
        })}
      </div>

      <div className='grid w-full grid-cols-7 gap-[0.4rem]'>
        {grid.map((d) => {
          const key = toKey(d);
          const isThisMonth = d.getMonth() === monthIdx;
          const isSelected = selectedKey === key;
          const disabled = !inRange(d, minDate, maxDate);
          const isToday = sameDate(d, today);
          const hasDot = !!markerMap[key];

          return (
            <button
              type='button'
              key={key}
              onClick={() => choose(d)}
              disabled={!isThisMonth || disabled}
              aria-pressed={isSelected}
              aria-current={isSelected ? 'date' : undefined}
              className='grid h-[4.8rem] w-[4.8rem] grid-rows-[4rem_0.8rem] place-items-center rounded-[8px] disabled:opacity-40'
            >
              {isSelected ? (
                <span className='bg-primary-700 grid h-[4rem] w-[4rem] place-items-center rounded-[8px]'>
                  <span className='text-[1.4rem] leading-[1.96rem] font-medium text-white'>{d.getDate()}</span>
                </span>
              ) : isToday && isThisMonth ? (
                <span className='bg-system-error grid h-[4rem] w-[4rem] place-items-center rounded-[9999px]'>
                  <span className='text-[1.4rem] leading-[1.96rem] font-medium text-white'>{d.getDate()}</span>
                </span>
              ) : (
                <span className={isThisMonth ? 'caption3 text-gray-900' : 'caption3 text-gray-600'}>{d.getDate()}</span>
              )}

              {/* 점(항상 0.8rem 슬롯 중앙) — 선택일은 숨김 */}
              {isThisMonth && !isSelected && hasDot ? (
                <span
                  aria-hidden
                  className={['block h-[0.8rem] w-[0.8rem] rounded-[9999px]', toneBg(markerMap[key])].join(' ')}
                />
              ) : (
                <span aria-hidden className='block h-[0.8rem] w-[0.8rem]' />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
