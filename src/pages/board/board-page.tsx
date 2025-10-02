import { useMemo, useState, useEffect, useRef } from 'react';
import PostCard from '@pages/board/components/post-card';
import type { IGroupCard } from '@pages/home/types/home.types';
import PillTab from '@components/tab/pill-tab';
import SearchBar from '@components/search-bar';
import UnderlineTab from '@components/tab/underline-tab';
import SelectDropdown from '@components/dropdown/select-dropdown';
import GroupCard from '@pages/home/components/card/group-card';
import { cn } from '@libs/cn';

type TabItem = { key: string; label: string };

const COMMUNITY_TABS: TabItem[] = [
  { key: 'community', label: '커뮤니티' },
  { key: 'reading', label: '독서 모임' },
];

const CATEGORIES: TabItem[] = [
  { key: 'all', label: '전체' },
  { key: 'recommend', label: '책 추천' },
  { key: 'daily', label: '일상' },
  { key: 'gather', label: '모임 모집' },
];

type Post = {
  id: string;
  title: string;
  content: string;
  commentCount: number;
  likeCount: number;
  date: string;
  author: string;
  category: string;
};

type SortType = 'latest' | 'popular';

const SORT_OPTIONS: ReadonlyArray<{ value: SortType; label: string }> = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
];

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    title: '게시글 제목',
    content: '내용이 여기에 들어갑니다. 내용이 여기에 들어갑니다. 내용이 여기에 들어갑니다. 내용이 여기에 들어갑니다.',
    commentCount: 9,
    likeCount: 9,
    date: '2025.09.21',
    author: '작성자이름',
    category: 'all',
  },
  {
    id: 'p2',
    title: '게시글 제목',
    content: '내용이 여기에 들어갑니다. 내용이 여기에 들어갑니다. 내용이 여기에 들어갑니다. 내용이 여기에 들어갑니다.',
    commentCount: 9,
    likeCount: 9,
    date: '2025.09.21',
    author: '작성자이름',
    category: 'all',
  },
  {
    id: 'p3',
    title: '게시글 제목',
    content: '내용이 여기에 들어갑니다. 내용이 여기에 들어갑니다. 내용이 여기에 들어갑니다. 내용이 여기에 들어갑니다.',
    commentCount: 9,
    likeCount: 9,
    date: '2025.09.21',
    author: '작성자이름',
    category: 'all',
  },
  {
    id: 'p4',
    title: '게시글 제목',
    content: '내용이 여기에 들어갑니다. 내용이 여기에 들어갑니다. 내용이 여기에 들어갑니다. 내용이 여기에 들어갑니다.',
    commentCount: 9,
    likeCount: 9,
    date: '2025.09.21',
    author: '작성자이름',
    category: 'all',
  },
];

const MOCK_GROUPS: IGroupCard[] = [
  {
    id: 1,
    imgurl: 'https://picsum.photos/seed/11/100/100',
    groupName: '그룹명',
    leaderName: '그룹장이름',
    memberCount: 8,
    description: '그룹에 대한 설명이 여기에 들어갑니다. 그룹에 대한 설명이...',
  },
  {
    id: 2,
    imgurl: '',
    groupName: '그룹명',
    leaderName: '그룹장이름',
    memberCount: 12,
    description: '그룹에 대한 설명이 여기에 들어갑니다. 그룹에 대한 설명이...',
  },
  {
    id: 3,
    imgurl: 'https://picsum.photos/seed/22/100/100',
    groupName: '그룹명',
    leaderName: '그룹장이름',
    memberCount: 5,
    description: '그룹에 대한 설명이 여기에 들어갑니다. 그룹에 대한 설명이...',
  },
  {
    id: 4,
    imgurl: '',
    groupName: '그룹명',
    leaderName: '그룹장이름',
    memberCount: 20,
    description: '그룹에 대한 설명이 여기에 들어갑니다. 그룹에 대한 설명이...',
  },
];

export default function BoardPage() {
  const [topTab, setTopTab] = useState<'community' | 'reading'>('community');
  const [category, setCategory] = useState<string>('all');
  const [sort, setSort] = useState<SortType>('latest');

  const searchAnchorRef = useRef<HTMLDivElement | null>(null);
  const floatingSearchRef = useRef<HTMLDivElement | null>(null);

  const [showFloatingSearch, setShowFloatingSearch] = useState(false);

  useEffect(() => {
    const el = searchAnchorRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShowFloatingSearch(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const filteredPosts = useMemo(() => {
    const list = category === 'all' ? MOCK_POSTS : MOCK_POSTS.filter((p) => p.category === category);
    return sort === 'popular' ? [...list].sort((a, b) => b.likeCount - a.likeCount) : list;
  }, [category, sort]);

  const searchPlaceholder = topTab === 'community' ? '검색어를 입력해 주세요.' : '독서모임명으로 검색';

  return (
    <div>
      <UnderlineTab
        items={COMMUNITY_TABS}
        value={topTab}
        onChange={(k) => setTopTab(k as 'community' | 'reading')}
        className={cn('sticky', showFloatingSearch ? 'top-[6.6rem]' : 'top-0')}
      />

      {showFloatingSearch && (
        <div
          ref={floatingSearchRef}
          className={cn('bg-gray-white sticky top-0 z-[var(--z-header)]', 'px-[2rem] pt-[0.8rem] pb-[0.8rem]')}
        >
          <SearchBar placeholder={searchPlaceholder} />
        </div>
      )}

      <div className='px-[2rem] pt-[1.2rem]' ref={searchAnchorRef}>
        <SearchBar placeholder={searchPlaceholder} />
      </div>

      {topTab === 'community' ? (
        <>
          <div className='flex-col-center gap-[0.9rem]'>
            <PillTab items={CATEGORIES} value={category} onChange={setCategory} />
            <div className='flex-row-between w-full px-[2rem]'>
              <div className='flex py-[1.2rem]'>
                <span className='caption2 text-gray-900'>
                  총 <span className='text-primary-700'>20개</span>
                </span>
              </div>

              <SelectDropdown<SortType>
                value={sort}
                options={SORT_OPTIONS}
                onChange={setSort}
                align='end'
                variant='title'
                menuWidthRem={12}
                itemHeightRem={3.2}
                className='relative'
              />
            </div>
          </div>

          <ul className='space-y-[0.1rem]'>
            {filteredPosts.map((p) => (
              <li key={p.id} className='bg-gray-white'>
                <PostCard
                  title={p.title}
                  content={p.content}
                  commentCount={p.commentCount}
                  likeCount={p.likeCount}
                  date={p.date}
                  author={p.author}
                />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <ul className='space-y-[1.2rem] bg-gray-50 px-[2.2rem] py-[2rem]'>
            {MOCK_GROUPS.map((g) => (
              <li key={g.id}>
                <GroupCard
                  id={g.id}
                  imgurl={g.imgurl}
                  groupName={g.groupName}
                  leaderName={g.leaderName}
                  memberCount={g.memberCount}
                  description={g.description}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
