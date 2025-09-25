import { useEffect, useMemo, useState } from 'react';
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
  const now = new Date();
  const initial: HMValue = value ?? { hour: now.getHours(), minute: now.getMinutes() };

  const [open, setOpen] = useState(defaultOpen);
  const [inner, setInner] = useState<HMValue>(initial);
  useEffect(() => {
    if (value) setInner(value);
  }, [value]);

  const hoursList = twelveHour ? HOURS12 : HOURS24;
  const initialHourIdx = twelveHour ? (inner.hour % 12 || 12) - 1 : inner.hour;
  const initialMinIdx = inner.minute;

  const [activeHourIdx, setActiveHourIdx] = useState<number>(initialHourIdx);
  const [activeMinIdx, setActiveMinIdx] = useState<number>(initialMinIdx);

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

  const common = {
    vertical: true,
    loop: true,
    mode: 'snap' as const,
    slides: { perView: 3, spacing: 0 },
    rubberband: false,
    dragSpeed: 0.8,
  };

  const [refHour] = useKeenSlider<HTMLDivElement>(
    {
      ...common,
      initial: initialHourIdx,
      created(s) {
        setActiveHourIdx(s.track.details.rel);
      },
      slideChanged(s) {
        const i = s.track.details.rel;
        setActiveHourIdx(i);
        setHourByIndex(i);
      },
    },
    [wheelStep(24)]
  );

  const [refMin] = useKeenSlider<HTMLDivElement>(
    {
      ...common,
      initial: initialMinIdx,
      created(s) {
        setActiveMinIdx(s.track.details.rel);
      },
      slideChanged(s) {
        const i = s.track.details.rel;
        setActiveMinIdx(i);
        setMinuteByIndex(i);
      },
    },
    [wheelStep(24)]
  );

  const label = useMemo(() => {
    const hh = twelveHour ? HOURS12[(inner.hour % 12 || 12) - 1] : pad2(inner.hour);
    return `${hh}:${pad2(inner.minute)}`;
  }, [inner.hour, inner.minute, twelveHour]);

  return (
    <div className={cn('relative inline-block', className)}>
      <button
        type='button'
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'h-[4.8rem] w-[18rem] px-[0.8rem]',
          'bg-gray-50',
          'rounded-[12px]',
          'flex items-center justify-between',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        )}
        aria-haspopup='dialog'
        aria-expanded={open}
      >
        <span className={cn('body2', value ? 'text-gray-900' : 'text-gray-500')}>{value ? label : placeholder}</span>
        <Icon name='arrow' size={1.2} className={open ? 'rotate-180 transition-transform' : ''} ariaHidden />
      </button>

      {open && (
        <div
          role='dialog'
          aria-label='시간 선택'
          className={cn('absolute z-50 mt-[0.8rem] p-[1.2rem]', 'bg-gray-white rounded-[12px] shadow-md')}
        >
          <div className='relative flex items-stretch gap-[1.2rem]'>
            <div className='pointer-events-none absolute top-1/2 right-0 left-0 h-[0px] border-y border-gray-200' />

            <div ref={refHour} className='keen-slider h-[12rem] w-[6rem] overflow-hidden rounded-[10px]'>
              {hoursList.map((h) => (
                <div key={`h-${h}`} className='keen-slider__slide grid h-[4rem] place-items-center'>
                  <span
                    className={
                      hoursList[activeHourIdx] === h
                        ? 'text-[2rem] leading-[2.8rem] font-semibold text-gray-900'
                        : 'text-[2rem] leading-[2.8rem] text-gray-500'
                    }
                  >
                    {h}
                  </span>
                </div>
              ))}
            </div>

            <div className='grid place-items-center text-gray-900'>
              <span className='text-[2rem] leading-[2.8rem] font-semibold'>:</span>
            </div>

            {/* 분 */}
            <div ref={refMin} className='keen-slider h-[12rem] w-[6rem] overflow-hidden rounded-[10px]'>
              {MINUTES.map((m) => (
                <div key={`m-${m}`} className='keen-slider__slide grid h-[4rem] place-items-center'>
                  <span
                    className={
                      MINUTES[activeMinIdx] === m
                        ? 'text-[2rem] leading-[2.8rem] font-semibold text-gray-900'
                        : 'text-[2rem] leading-[2.8rem] text-gray-500'
                    }
                  >
                    {m}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-[1.2rem] flex justify-end gap-[0.8rem]'>
            <button
              type='button'
              className='h-[3.6rem] rounded-[10px] bg-gray-50 px-[1.2rem] text-gray-700'
              onClick={() => setOpen(false)}
            >
              닫기
            </button>
            <button
              type='button'
              className='bg-primary-700 h-[3.6rem] rounded-[10px] px-[1.2rem] text-white'
              onClick={() => setOpen(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
