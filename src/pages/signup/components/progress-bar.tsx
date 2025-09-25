import { cn } from '@libs/cn';

type BaseProps = {
  /** 트랙 클래스 (배경) */
  trackClassName?: string;
  /** 채워지는 바 클래스 */
  barClassName?: string;
  /** 컨테이너 클래스 */
  className?: string;
  /** 높이(px/rem 클래스) */
  heightClassName?: string; // e.g. 'h-[0.6rem]'
  /** 둥근 모서리 정도 */
  roundedClassName?: string; // e.g. 'rounded-full'
  /** aria-label 대체 텍스트 */
  ariaLabel?: string;
};

type PercentMode = {
  /** 0~100 */
  percent: number;
  step?: never;
  steps?: never;
};

type StepMode = {
  /** 현재 스텝(1-base 가능) */
  step: number;
  /** 전체 스텝 */
  steps: number;
  percent?: never;
};

type ProgressBarProps = (PercentMode | StepMode) & BaseProps;

export default function ProgressBar({
  percent,
  step,
  steps,
  trackClassName = 'bg-gray-200',
  barClassName = 'bg-system-success',
  className,
  heightClassName = 'h-[0.6rem]',
  roundedClassName = 'rounded-full',
  ariaLabel = 'progress',
}: ProgressBarProps) {
  const pct =
    typeof percent === 'number'
      ? Math.min(100, Math.max(0, percent))
      : steps! > 0
        ? Math.min(100, Math.max(0, (step! / steps!) * 100))
        : 0;

  return (
    <div className='px-[0.8rem] py-[1.6rem]'>
      <div
        role='progressbar'
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        className={cn('w-full', className)}
      >
        <div className={cn(heightClassName, roundedClassName, trackClassName)}>
          <div className={cn(heightClassName, roundedClassName, barClassName)} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
