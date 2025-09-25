import Icon from '@components/icon';

type Props = {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  prevIconName?: string;
  nextIconName?: string;
};

export default function CalendarHeader({
  label,
  onPrev,
  onNext,
  prevIconName = 'arrow',
  nextIconName = 'arrow',
}: Props) {
  return (
    <div className='inline-flex items-center justify-center gap-[2.4rem]'>
      <button
        type='button'
        aria-label='이전 달'
        onClick={onPrev}
        className='flex h-[3.2rem] w-[3.2rem] cursor-pointer items-center justify-center rounded-[12px]'
      >
        <Icon name={prevIconName} size={1.8} ariaHidden />
      </button>

      <span className='body2 text-gray-900'>{label}</span>

      <button
        type='button'
        aria-label='다음 달'
        onClick={onNext}
        className='flex h-[3.2rem] w-[3.2rem] cursor-pointer items-center justify-center rounded-[12px]'
      >
        <Icon name={nextIconName} rotate={180} size={1.8} ariaHidden />
      </button>
    </div>
  );
}
