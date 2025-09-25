import { toneBg } from '@components/calendar/utils/calendar';
import type { MarkerTone } from '@components/calendar/types/calendar';

type Props = {
  date: Date;
  isThisMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  disabled: boolean;
  dotTone?: MarkerTone;
  onSelect: (d: Date) => void;
};

export default function DayCell({ date, isThisMonth, isSelected, isToday, disabled, dotTone, onSelect }: Props) {
  const key = date.getTime();
  const number = date.getDate();

  return (
    <button
      type='button'
      key={key}
      onClick={() => onSelect(date)}
      disabled={!isThisMonth || disabled}
      aria-pressed={isSelected}
      aria-current={isSelected ? 'date' : undefined}
      className='grid h-[4.8rem] w-[4.8rem] grid-rows-[4rem_0.8rem] place-items-center rounded-[8px] disabled:opacity-40'
    >
      {isSelected ? (
        <span className='bg-primary-700 grid h-[4rem] w-[4rem] place-items-center rounded-[8px]'>
          <span className='text-[1.4rem] leading-[1.96rem] font-medium text-white'>{number}</span>
        </span>
      ) : isToday && isThisMonth ? (
        <span className='bg-system-error grid h-[4rem] w-[4rem] place-items-center rounded-[9999px]'>
          <span className='text-[1.4rem] leading-[1.96rem] font-medium text-white'>{number}</span>
        </span>
      ) : (
        <span className={isThisMonth ? 'caption3 text-gray-900' : 'caption3 text-gray-600'}>{number}</span>
      )}

      {isThisMonth && !isSelected && dotTone ? (
        <span aria-hidden className={['block h-[0.8rem] w-[0.8rem] rounded-[9999px]', toneBg(dotTone)].join(' ')} />
      ) : (
        <span aria-hidden className='block h-[0.8rem] w-[0.8rem]' />
      )}
    </button>
  );
}
