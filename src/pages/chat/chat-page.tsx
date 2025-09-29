import { useState } from 'react';
import PillTab from '@components/tab/pill-tab';
import ChatCard from '@pages/chat/components/chat-card';
import { useNavigate } from 'react-router-dom';

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'direct', label: '일대일' },
  { key: 'group', label: '그룹' },
];

export default function ChatListPage() {
  const [tab, setTab] = useState('all');
  const navigate = useNavigate();

  return (
    <div className='min-h-dvh bg-white text-gray-900'>
      <PillTab items={TABS} value={tab} onChange={setTab} className='pt-[1.2rem]' />

      <div className='flex-col gap-[1.2rem] px-[2rem] pb-[2rem]'>
        {(tab === 'all' || tab === 'direct') && (
          <>
            <ChatCard
              title='사용자명'
              subtitle='모순 외 1건'
              preview='안녕하세요. 책 거래하실 건가요? 지금 다른 분께도 연락이 와서요'
              unread={4}
              onClick={() => navigate('/chat/1')}
              badge='대여 상태'
            />
            <ChatCard
              title='사용자명'
              subtitle='노르웨이의 숲'
              preview='안녕하세요. 책 거래하실 건가요? 지금 다른 분께도 연락이 와서요'
              muted
              onClick={() => navigate('/chat/1')}
              badge='대여 상태'
            />
          </>
        )}

        {(tab === 'all' || tab === 'group') && (
          <>
            <ChatCard
              title='모임명'
              preview='안녕하세요. 책 거래하실 건가요? 지금 다른 분께도 연락이 와서요'
              unread={4}
              onClick={() => navigate('/chat/1')}
              avatarNumber={8}
            />
            <ChatCard
              title='모임명'
              preview='안녕하세요. 책 거래하실 건가요? 지금 다른 분께도 연락이 와서요'
              unread={4}
              onClick={() => navigate('/chat/1')}
              avatarNumber={8}
            />
            <ChatCard
              title='모임명'
              preview='안녕하세요. 책 거래하실 건가요? 지금 다른 분께도 연락이 와서요'
              unread={4}
              onClick={() => navigate('/chat/1')}
              avatarNumber={10}
            />
          </>
        )}

        {(tab === 'all' || tab === 'direct') && (
          <ChatCard
            title='사용자명'
            subtitle='책 제목'
            preview='안녕하세요. 책 거래하실 건가요? 지금 다른 분께도 연락이 와서요'
            unread={4}
            onClick={() => navigate('/chat/1')}
            badge='대여 상태'
          />
        )}
      </div>
    </div>
  );
}
