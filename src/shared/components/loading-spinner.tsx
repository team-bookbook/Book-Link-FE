import Icon from '@components/icon';

type LoadingProps = {
  title?: string;
  subtitle?: string;
  sizeRem?: number;
  iconSizeRem?: number;
  className?: string;
  'aria-label'?: string;
};

export default function LoadingSpinner({
  title = '로딩 중입니다.',
  subtitle = '잠시만 기다려 주세요!',
  sizeRem = 20,
  iconSizeRem = 6,
  className,
  'aria-label': ariaLabel = '콘텐츠 로딩 중',
}: LoadingProps) {
  const strokeWidth = 12;
  const r = 48 - strokeWidth / 2;
  const circumference = 2 * Math.PI * r;
  const arc = circumference * 0.3;
  const gap = circumference - arc;

  return (
    <section
      role='status'
      aria-live='polite'
      aria-label={ariaLabel}
      className={['flex-col-center gap-[2rem] px-[2rem] text-center', className].filter(Boolean).join(' ')}
    >
      <div className='relative grid place-items-center' style={{ width: `${sizeRem}rem`, height: `${sizeRem}rem` }}>
        <svg className='absolute inset-0' viewBox='0 0 100 100' width='100%' height='100%'>
          <circle cx='50' cy='50' r={r} fill='none' stroke='var(--color-secondary-100)' strokeWidth={strokeWidth} />
        </svg>
        <svg
          className='absolute inset-0 animate-spin'
          viewBox='0 0 100 100'
          width='100%'
          height='100%'
          style={{ animationDuration: '1.2s' }}
        >
          <circle
            cx='50'
            cy='50'
            r={r}
            fill='none'
            stroke='var(--color-secondary-900)'
            strokeWidth={strokeWidth}
            strokeLinecap='round'
            strokeDasharray={`${arc} ${gap}`}
            transform='rotate(-90 50 50)'
          />
        </svg>
        <Icon name='cat' size={iconSizeRem} className='text-gray-600' />
      </div>

      <div className='flex-col-center gap-[0.8rem]'>
        <p className='title3 text-gray-900'>{title}</p>
        <p className='body5 text-gray-500'>{subtitle}</p>
      </div>
    </section>
  );
}
