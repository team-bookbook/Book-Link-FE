import type { INotification } from '@apis/notification/notification-queries';
import Icon from '@components/icon';

interface NotificationCardProps {
  notification: INotification;
}

export default function NotificationCard({ notification }: NotificationCardProps) {
  // type에 따른 카테고리 매핑
  const categoryLabel = notification.type.type === 'RETURN_DUE' ? '도서' : '알림';

  // 날짜 포맷팅 (간단한 예시)
  const formattedDate = new Date(notification.createdAt).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className='flex items-start gap-[0.6rem] rounded-[10px] bg-white p-[2rem]'>
      <Icon name='notification-book' size={1.9} ariaHidden className='mt-[0.1rem] text-gray-900' />
      <div className='w-full flex-col gap-[0.6rem]'>
        <div className='flex-row-between'>
          <h3 className='caption5 text-gray-500'>{categoryLabel}</h3>
          <h3 className='caption5 text-gray-500'>방금 전</h3>
        </div>
        <h2 className='body5 line-clamp-2 cursor-pointer text-gray-900'>{notification.message}</h2>
        <h2 className='caption5 text-gray-900'>{formattedDate}</h2>
      </div>
    </div>
  );
}
