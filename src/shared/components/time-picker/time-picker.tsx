import { useEffect, useMemo, useRef, useState } from 'react';
import { useKeenSlider, type KeenSliderPlugin } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { cn } from '@libs/cn';
import Icon from '@components/icon';

export type HMValue = { hour: number; minute: number };

type Props = {
  value?: HMValue; // 0~23 / 0~59
  onChange?: (v: HMValue) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultOpen?: boolean;
  twelveHour?: boolean; // true면 표시는 12h(01~12), 값은 24h 유지
};

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const HOURS24 = Array.from({ length: 24 }, (_, i) => pad2(i));
const HOURS12 = Array.from({ length: 12 }, (_, i) => pad2((i + 1) % 12 || 12));
const MINUTES = Array.from({ length: 60 }, (_, i) => pad2(i));

/* 휠 한칸 이동 플러그인 */
const wheelStep =
  (threshold = 20): KeenSliderPlugin =>
  (slider) => {
    let acc = 0;
    const node = slider.container;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      acc += e.deltaY;
      if (Math.abs(acc) >= threshold) {
        slider.moveToIdx(slider.track.details.abs + (acc > 0 ? 1 : -1), true);
        acc = 0;
      }
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    slider.on('destroyed', () => node.removeEventListener('wheel', onWheel));
  };

export default function TimePicker({
  value,
  onChange,
  className = '',
  placeholder = '시간 선택',
  disabled,
  defaultOpen = false,
  twelveHour = false,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const now = new Date();
  const initial: HMValue = value ?? { hour: now.getHours(), minute: now.getMinutes() };

  const [open, setOpen] = useState(defaultOpen);
  const [inner, setInner] = useState<HMValue>(initial);
  useEffect(() => {
    if (value) setInner(value);
  }, [value]);

  const hoursList = twelveHour ? HOURS12 : HOURS24;

  const valueHourIdx = twelveHour ? (inner.hour % 12 || 12) - 1 : inner.hour;
  const valueMinIdx = inner.minute;

  const initialHourCenter = (valueHourIdx - 1 + hoursList.length) % hoursList.length;
  const initialMinCenter = (valueMinIdx - 1 + MINUTES.length) % MINUTES.length;

  const [activeHourIdx, setActiveHourIdx] = useState<number>(initialHourCenter);
  const [activeMinIdx, setActiveMinIdx] = useState<number>(initialMinCenter);

  const selectedHourIdx = (activeHourIdx + 1) % hoursList.length;
  const selectedMinIdx = (activeMinIdx + 1) % MINUTES.length;

  const setHourByIndex = (idx: number) => {
    const hour24 = twelveHour ? ((idx + 1) % 12) + (inner.hour >= 12 ? 12 : 0) : idx;
    const next = { hour: hour24 % 24, minute: inner.minute };
    setInner(next);
    onChange?.(next);
  };
  const setMinuteByIndex = (idx: number) => {
    const next = { hour: inner.hour, minute: idx % 60 };
    setInner(next);
    onChange?.(next);
  };

  function modeSnap(): 'snap' {
    return 'snap';
  }
  function alignCenter(): 'center' {
    return 'center';
  }

  const common = {
    vertical: true,
    loop: true,
    mode: modeSnap(),
    align: alignCenter(),
    slides: { perView: 3, spacing: 0 },
    rubberband: false,
    dragSpeed: 0.8,
  };

  const [refHour] = useKeenSlider<HTMLDivElement>(
    {
      ...common,
      initial: initialHourCenter,
      created(s) {
        setActiveHourIdx(s.track.details.rel);
        setHourByIndex((s.track.details.rel + 1) % hoursList.length);
      },
      slideChanged(s) {
        const rel = s.track.details.rel;
        setActiveHourIdx(rel);
        setHourByIndex((rel + 1) % hoursList.length);
      },
    },
    [wheelStep(24)]
  );

  const [refMin] = useKeenSlider<HTMLDivElement>(
    {
      ...common,
      initial: initialMinCenter,
      created(s) {
        setActiveMinIdx(s.track.details.rel);
        setMinuteByIndex((s.track.details.rel + 1) % MINUTES.length);
      },
      slideChanged(s) {
        const rel = s.track.details.rel;
        setActiveMinIdx(rel);
        setMinuteByIndex((rel + 1) % MINUTES.length);
      },
    },
    [wheelStep(24)]
  );

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent | TouchEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (!(e.target instanceof Node)) return;
      if (!root.contains(e.target)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const label = useMemo(() => {
    const hh = twelveHour ? HOURS12[(inner.hour % 12 || 12) - 1] : pad2(inner.hour);
    return `${hh}:${pad2(inner.minute)}`;
  }, [inner.hour, inner.minute, twelveHour]);

  return (
    <div ref={rootRef} className={cn('relative inline-block', className)}>
      <button
        type='button'
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'h-[4.8rem] w-full px-[0.8rem]',
          'bg-gray-50',
          'rounded-[12px]',
          'flex-row-between',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )}
        aria-haspopup='dialog'
        aria-expanded={open}
      >
        <span className={cn('caption1', value ? 'text-gray-700' : 'text-gray-500')}>{value ? label : placeholder}</span>
        <Icon name='dropdown' size={1.2} className={open ? 'rotate-180 transition-transform' : ''} ariaHidden />
      </button>

      {open && (
        <div
          role='dialog'
          aria-label='시간 선택'
          className={cn('absolute z-[var(--z-overlay)] p-[1.2rem]', 'rounded-[12px] bg-gray-50 shadow-md')}
        >
          <div className='relative flex items-stretch gap-[1.2rem]'>
            <div className='pointer-events-none absolute inset-x-0' style={{ top: 'calc(50% - 2rem)' }}>
              <div className='h-[0px] border-t border-gray-200' />
            </div>
            <div className='pointer-events-none absolute inset-x-0' style={{ top: 'calc(50% + 2rem)' }}>
              <div className='h-[0px] border-t border-gray-200' />
            </div>

            <div ref={refHour} className='keen-slider h-[12rem] w-[6rem] overflow-hidden rounded-[10px]'>
              {hoursList.map((h) => (
                <div key={`h-${h}`} className='keen-slider__slide grid h-[4rem] place-items-center'>
                  <span className={hoursList[selectedHourIdx] === h ? 'title4 text-gray-900' : 'title4 text-gray-500'}>
                    {h}
                  </span>
                </div>
              ))}
            </div>

            {/* 분 */}
            <div ref={refMin} className='keen-slider h-[12rem] w-[6rem] overflow-hidden rounded-[10px]'>
              {MINUTES.map((m) => (
                <div key={`m-${m}`} className='keen-slider__slide grid h-[4rem] place-items-center'>
                  <span className={MINUTES[selectedMinIdx] === m ? 'title4 text-gray-900' : 'title4 text-gray-500'}>
                    {m}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
