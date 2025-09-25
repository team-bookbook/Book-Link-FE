import { useMemo, useState, useCallback, useEffect } from 'react';
import { cn } from '@libs/cn';
import CalendarHeader from './calendar-header';
import DayCell from './day-cell';
import { WEEK_LABELS, pad2, toKey, addMonths, buildGrid, inRange, sameDate } from '@components/calendar/utils/calendar';
import type { CalendarProps, MarkerTone } from '@components/calendar/types/calendar';

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
      <CalendarHeader
        label={headerLabel}
        onPrev={prev}
        onNext={next}
        prevIconName={prevIconName}
        nextIconName={nextIconName}
      />

      {/* 요일 */}
      <div className='grid w-full grid-cols-7 gap-[0.4rem]'>
        {WEEK_LABELS.map((w) => {
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

      {/* 날짜 */}
      <div className='grid w-full grid-cols-7 gap-[0.4rem]'>
        {grid.map((d) => {
          const key = toKey(d);
          const isThisMonth = d.getMonth() === monthIdx;
          const isSelected = selectedKey === key;
          const disabled = !inRange(d, minDate, maxDate);
          const isToday = sameDate(d, today);
          const dotTone = markerMap[key];

          return (
            <DayCell
              key={key}
              date={d}
              isThisMonth={isThisMonth}
              isSelected={isSelected}
              isToday={isToday}
              disabled={disabled}
              dotTone={dotTone}
              onSelect={choose}
            />
          );
        })}
      </div>
    </div>
  );
}
