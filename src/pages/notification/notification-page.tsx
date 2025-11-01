import { useState } from 'react';
import PillTab from '@components/tab/pill-tab';
import EmptyState from '@components/empty/empty-state';
import NotificationCard from './components/notification-card';
import { useQuery } from '@tanstack/react-query';
import { notificationQueries } from '@apis/notification/notification-queries';
import { memberQueries } from '@apis/member/member-queries';
import { isAuthenticated } from '@/shared/utils/auth';

type TabKey = 'all' | 'chat' | 'book' | 'board';

export default function NotificationPage() {
  const [tab, setTab] = useState<TabKey>('all');
  const { data: memberData } = useQuery({
    ...memberQueries.GET_ME(),
    enabled: isAuthenticated(),
  });
  console.log(memberData?.id);
  const { data: notificationData } = useQuery(notificationQueries.GET_NOTIFICATION(memberData?.id));

  const isEmpty = !notificationData || notificationData.length === 0;

  return (
    <div>
      <PillTab
        items={[
          { key: 'all', label: '전체' },
          { key: 'chat', label: '채팅' },
          { key: 'book', label: '도서' },
          { key: 'board', label: '게시판' },
        ]}
        value={tab}
        onChange={(k) => setTab(k as TabKey)}
      />

      <div className='mt-[1.6rem]'>
        {tab === 'all' &&
          (isEmpty ? (
            <EmptyState kind='notification' />
          ) : (
            <div className='bg-gray-50 px-[2rem]'>
              {notificationData?.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
