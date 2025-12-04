import Icon from '@components/icon';
import UnderlineTab from '@components/tab/underline-tab';
import { useParams, useSearchParams } from 'react-router-dom';
import type { TabItem } from './board-page';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@libs/cn';
import Divider from '@components/divider';
import type { ScheduleCardProps } from './components/schedule-card';
import SectionSchedule from './components/section/section-schedule';
import SectionParticipant from './components/section/section-participant';
import ButtonFrame from '@components/button/button-frame';
import Button from '@components/button/button';
import { groupQueries } from '@apis/group/group-queries';
import { useQuery } from '@tanstack/react-query';

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
  const { id } = useParams<{ id: string }>();

  const [searchParams, setSearchParams] = useSearchParams();
  const topTab = (searchParams.get('tab') as 'schedule' | 'participant') || 'schedule';
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);
  const searchAnchorRef = useRef<HTMLDivElement | null>(null);

  const { data: groupDetail, isLoading } = useQuery({
    ...groupQueries.GET_GROUP_DETAIL(id || ''),
    enabled: !!id,
  });

  console.log(groupDetail);

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

  if (!id) {
    return (
      <main className='flex-col-center py-[4rem]'>
        <p className='body5 text-gray-500'>모임을 찾을 수 없습니다.</p>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className='flex-col-center py-[4rem]'>
        <p className='body5 text-gray-500'>로딩 중...</p>
      </main>
    );
  }

  if (!groupDetail) {
    return (
      <main className='flex-col-center py-[4rem]'>
        <p className='body5 text-gray-500'>모임 정보를 불러올 수 없습니다.</p>
      </main>
    );
  }

  // Todo : 헤더 오버라이드 추가
  // const headerConfig = useMemo(() => {
  //   if (!groupDetail) return null;

  //   return {
  //     left: 'back' as const,
  //     safeTop: true,
  //     title: groupDetail.name,
  //     actions: groupDetail.isOwner ? ['kebab' as const] : [],
  //     onAction: (action: ActionId) => {
  //       if (action === 'kebab') {
  //         openManageSheet();
  //       }
  //     },
  //   };
  // }, [boardDetail, openManageSheet]);

  // useHeaderOverride(headerConfig);

  return (
    <main className='mb-[8rem]'>
      <section className='flex-col gap-[2rem] p-[2rem]'>
        <div className='flex-row-center h-[15rem] w-full bg-gray-100'>
          <Icon name='logo-alt' size={5} className='text-[#b5b5b5]' />
        </div>
        <span className='flex-row-between'>
          <h1 className='title5'>{groupDetail.name}</h1>
          <h2 className='body5'>
            {groupDetail.participantCount}/{groupDetail.maxCapacity}명
          </h2>
        </span>
        <p className='body5 mt-[2rem]'>{groupDetail.description}</p>
      </section>
      <Divider />
      <section>
        <UnderlineTab
          items={GROUP_TABS}
          value={topTab}
          onChange={handleTabChange}
          className={cn('sticky', showFloatingSearch ? 'top-[6.5rem]' : 'top-0')}
        />
        {topTab === 'schedule' ? <SectionSchedule schedules={MOCK_SCHEDULES} /> : <SectionParticipant id={id} />}
      </section>
      <ButtonFrame>
        <Button fullWidth roundStyle='rounded-[12px]' className='py-[1.2rem]'>
          가입하기
        </Button>
      </ButtonFrame>
    </main>
  );
}
