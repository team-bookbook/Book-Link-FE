import Icon from '@components/icon';
import { cn } from '@libs/cn';

export interface Member {
  id: string;
  name: string;
}

export type EventStatus = 'PLANNED' | 'ONGOING' | 'FINISHED' | 'CANCELLED';

export interface ScheduleCardProps {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  participantCount: number;
  location: string;
  status: EventStatus;
  createTime: string;
  memberList: Member[];
}

const STATUS_LABELS: Record<EventStatus, string> = {
  PLANNED: '예정',
  ONGOING: '진행중',
  FINISHED: '종료',
  CANCELLED: '취소',
};

const STATUS_COLORS: Record<EventStatus, string> = {
  PLANNED: 'bg-primary-100 text-primary-700',
  ONGOING: 'bg-secondary-100 text-secondary-700',
  FINISHED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-system-error-light text-system-error',
};

export default function ScheduleCard({
  id,
  title,
  startTime,
  participantCount,
  location,
  status,
  memberList,
}: ScheduleCardProps) {
  const handleClick = () => {
    console.log('Schedule clicked:', id);
  };

  // 날짜 포맷팅 (예: 2025-07-17T15:00:00 → 2025.07.17 오후 3시)
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? '오후' : '오전';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

    return `${year}.${month}.${day} ${period} ${displayHours}시${minutes !== '00' ? ` ${minutes}분` : ''}`;
  };

  const hostMember = memberList[0];
  const maxParticipants = 20; // 임시값, 실제로는 API에서 받아야 함

  return (
    <div
      onClick={handleClick}
      className={cn(
        'bg-gray-white w-full cursor-pointer rounded-[10px] border-1 border-gray-200 px-[2rem] py-[1.5rem] transition-all duration-200 hover:bg-gray-50'
      )}
    >
      <div className='flex items-center justify-between'>
        <h1 className='title6'>{title}</h1>
        <span className={cn('caption4 rounded-[4px] px-[0.8rem] py-[0.4rem]', STATUS_COLORS[status])}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* {description && <p className='body6 mt-[0.8rem] text-gray-700'>{description}</p>} */}

      <div className='mt-[1.6rem] flex-col gap-[0.8rem]'>
        <span className='body5 flex gap-[0.5rem]'>
          <h2 className='text-gray-700'>일정</h2>
          <h2 className='text-gray-700'>|</h2>
          <h2>{formatDateTime(startTime)}</h2>
        </span>
        <span className='body5 flex gap-[0.5rem]'>
          <h2 className='text-gray-700'>장소</h2>
          <h2 className='text-gray-700'>|</h2>
          <h2>{location}</h2>
        </span>
      </div>

      <div className='flex-row-between mt-[3.2rem]'>
        <div className='flex gap-[1rem]'>
          <div className='flex-row-center min-h-[4rem] min-w-[4rem] rounded-full bg-gray-200'>
            {hostMember ? (
              <Icon name='profile' size={2.4} className='text-gray-600' />
            ) : (
              <Icon name='logo-alt' size={2.4} className='text-gray-400' />
            )}
          </div>
          <span className='flex-col justify-center'>
            <h2 className='caption1'>{hostMember?.name || '모집자'}</h2>
            <h3 className='caption3 text-gray-600'>
              {participantCount}/{maxParticipants}명
            </h3>
          </span>
        </div>
        <Icon name='logout' size={2.4} className='text-gray-600' />
      </div>
    </div>
  );
}
