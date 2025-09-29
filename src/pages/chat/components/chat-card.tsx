import { cn } from '@libs/cn';

type Props = {
  title: string;
  subtitle?: string;
  preview: string;
  unread?: number;
  muted?: boolean;
  /** “대여 상태” 같은 라벨이 필요할 때 */
  badge?: string;
  /** 그룹일 때 아바타 안에 표시할 숫자(없으면 일반 사용자) */
  avatarNumber?: number;
  className?: string;
  onClick?: () => void;
};

export default function ChatCard({
  title,
  subtitle,
  preview,
  unread = 0,
  muted,
  badge,
  avatarNumber,
  className,
  onClick,
}: Props) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'w-full cursor-pointer text-left',
        'rounded-[16px] bg-gray-50 p-[1.6rem]',
        'flex items-center gap-[1.6rem]',
        muted && 'opacity-60',
        className
      )}
    >
      <div
        className={cn(
          'grid shrink-0 place-items-center',
          'text-secondary-900 h-[4rem] w-[4rem] rounded-[16px] bg-[#C6E8FF]'
        )}
      >
        {typeof avatarNumber === 'number' ? <span className='caption2 font-semibold'>{avatarNumber}</span> : null}
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex items-center justify-between gap-[0.8rem]'>
          <p className='title6 truncate text-gray-900'>{title}</p>
          {badge ? (
            <span className='caption3 shrink-0 rounded-[6px] bg-gray-100 px-[0.8rem] py-[0.4rem] text-gray-700'>
              {badge}
            </span>
          ) : null}
        </div>

        {subtitle ? <p className='caption2 text-gray-500'>{subtitle}</p> : null}

        <div className='mt-[0.2rem] flex items-center gap-[0.8rem]'>
          <p className='caption2 flex-1 truncate text-gray-600'>{preview}</p>
          {unread > 0 ? (
            <span className='grid h-[1.6rem] min-w-[1.6rem] place-items-center rounded-full bg-[#FF5656] px-[0.4rem]'>
              <span className='caption3 text-white'>{unread}</span>
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
