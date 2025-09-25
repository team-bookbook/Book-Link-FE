// src/pages/notification/notification-page.tsx
import { useState } from 'react';
import PillTab from '@components/tab/pill-tab';
import EmptyState from '@components/empty/empty-state';

type TabKey = 'all' | 'chat' | 'book' | 'board';

export default function NotificationPage() {
  const [tab, setTab] = useState<TabKey>('all');

  // 예시: 현재는 모든 탭이 비어있다고 가정
  const isEmpty = true;

  return (
    <section className='p-[1.6rem]'>
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
        {tab === 'all' && (isEmpty ? <EmptyState kind='notification' /> : <div>알림 전체 보기</div>)}

        {tab === 'chat' && (isEmpty ? <EmptyState kind='notification' /> : <div>채팅 알림</div>)}

        {tab === 'book' && (isEmpty ? <EmptyState kind='notification' /> : <div>도서 알림</div>)}

        {tab === 'board' && (isEmpty ? <EmptyState kind='notification' /> : <div>게시판 알림</div>)}
      </div>
    </section>
  );
}
