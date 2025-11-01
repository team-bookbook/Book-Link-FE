import { useState } from 'react';
import PillTab from '@components/tab/pill-tab';
import EmptyState from '@components/empty/empty-state';
import NotificationCard from './components/notification-card';

type TabKey = 'all' | 'chat' | 'book' | 'board';

export default function NotificationPage() {
  const [tab, setTab] = useState<TabKey>('all');

  const isEmpty = false;

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
              <NotificationCard />
              <NotificationCard />
              <NotificationCard />
              <NotificationCard />
            </div>
          ))}

        {tab === 'chat' && (isEmpty ? <EmptyState kind='notification' /> : <div>채팅 알림</div>)}

        {tab === 'book' && (isEmpty ? <EmptyState kind='notification' /> : <div>도서 알림</div>)}

        {tab === 'board' && (isEmpty ? <EmptyState kind='notification' /> : <div>게시판 알림</div>)}
      </div>
    </div>
  );
}
