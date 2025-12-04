import Icon from '@components/icon';
import UnderlineTab from '@components/tab/underline-tab';
import { useSearchParams } from 'react-router-dom';
import type { TabItem } from './board-page';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@libs/cn';
import Divider from '@components/divider';
import Calendar from '@components/calendar/calendar';
import ScheduleCard, { type ScheduleCardProps } from './components/schedule-card';

const GROUP_TABS: TabItem[] = [
  { key: 'schedule', label: '일정' },
  { key: 'participant', label: '참여자 정보' },
];

const MOCK_SCHEDULES: ScheduleCardProps[] = [
  {
    id: '1',
    title: '1월 정기 독서 모임',
    description: '이번 달 도서는 "1984"입니다. 자유롭게 의견 나눠요!',
    startTime: '2025-01-15T19:00:00',
    endTime: '2025-01-15T21:00:00',
    participantCount: 8,
    location: '강남역 스타벅스',
    status: 'PLANNED',
    createTime: '2025-01-01T10:00:00',
    memberList: [
      { id: 'host1', name: '김독서' },
      { id: 'm1', name: '이책방' },
      { id: 'm2', name: '박도서관' },
    ],
  },
  {
    id: '2',
    title: 'SF 소설 토론회',
    description: '듄 시리즈에 대해 이야기해요',
    startTime: '2025-01-20T14:00:00',
    endTime: '2025-01-20T16:00:00',
    participantCount: 5,
    location: '홍대입구역 카페 북',
    status: 'ONGOING',
    createTime: '2025-01-10T15:30:00',
    memberList: [
      { id: 'host2', name: '최SF' },
      { id: 'm3', name: '정미래' },
    ],
  },
  {
    id: '3',
    title: '12월 송년 모임',
    description: '올해의 베스트 도서 추천 및 나눔',
    startTime: '2024-12-28T18:00:00',
    endTime: '2024-12-28T20:00:00',
    participantCount: 12,
    location: '신촌 북카페',
    status: 'FINISHED',
    createTime: '2024-12-01T09:00:00',
    memberList: [
      { id: 'host3', name: '송독서' },
      { id: 'm4', name: '강책' },
      { id: 'm5', name: '윤문학' },
    ],
  },
];

export default function GroupDetailPage() {
  // const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const topTab = (searchParams.get('tab') as 'schedule' | 'participant') || 'schedule';
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);
  const searchAnchorRef = useRef<HTMLDivElement | null>(null);

  // 일정 정렬 (날짜순)
  const sortedSchedules = [...MOCK_SCHEDULES].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  useEffect(() => {
    const el = searchAnchorRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShowFloatingSearch(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const updateParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === 'ALL' || value === 'LATEST') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams, { replace: true });
  };

  const handleTabChange = (tab: string) => {
    updateParams({ tab });
  };

  return (
    <main>
      <section className='flex-col gap-[2rem] p-[2rem]'>
        <div className='flex-row-center h-[15rem] w-full bg-gray-100'>
          <Icon name='logo-alt' size={5} className='text-[#b5b5b5]' />
        </div>
        <span className='flex-row-between'>
          <h1 className='title5'>독서 모임 모집합니다!</h1>
          <h2 className='body5'>n명</h2>
        </span>
        <p className='body5 mt-[2rem]'>
          설명글이 여기에 들어갑니다. 설명글이 여기에 들어갑니다.설명글이 여기에 들어갑니다.
        </p>
      </section>
      <Divider />
      <section>
        <UnderlineTab
          items={GROUP_TABS}
          value={topTab}
          onChange={handleTabChange}
          className={cn('sticky', showFloatingSearch ? 'top-[6.5rem]' : 'top-0')}
        />
        <div className='flex-col gap-[2rem] p-[2rem]'>
          <Calendar />
          <div className='flex-col gap-[1.2rem]'>
            {sortedSchedules.length === 0 ? (
              <p className='body5 py-[4rem] text-center text-gray-500'>등록된 일정이 없습니다.</p>
            ) : (
              sortedSchedules.map((schedule) => <ScheduleCard key={schedule.id} {...schedule} />)
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
