import { useState } from 'react';
import PillTab from '@components/tab/pill-tab';

type TabKey = 'all' | 'chat' | 'book' | 'board';

export default function NotificationPage() {
  const [tab, setTab] = useState<TabKey>('all');

  return (
    <section>
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
        {tab === 'all' && <div>알림 전체 보기</div>}
        {tab === 'chat' && <div>채팅 알림</div>}
        {tab === 'book' && <div>도서 알림</div>}
        {tab === 'board' && <div>게시판 알림</div>}
      </div>
    </section>
  );
}
