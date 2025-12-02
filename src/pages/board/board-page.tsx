import { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '@pages/board/components/post-card';
import type { IGroupCard } from '@pages/home/types/home.types';
import PillTab from '@components/tab/pill-tab';
import SearchBar from '@components/search-bar';
import UnderlineTab from '@components/tab/underline-tab';
import SelectDropdown from '@components/dropdown/select-dropdown';
import GroupCard from '@pages/home/components/card/group-card';
import { cn } from '@libs/cn';
import { useQuery } from '@tanstack/react-query';
import { boardQueries } from '@apis/board/board-queries';
import { formatDate } from '@/shared/utils/formatDate';

export type TabItem = { key: string; label: string };

const COMMUNITY_TABS: TabItem[] = [
  { key: 'community', label: '커뮤니티' },
  { key: 'reading', label: '독서 모임' },
];

export const CATEGORIES: TabItem[] = [
  { key: 'ALL', label: '전체' },
  { key: 'RECOMMEND', label: '책 추천' },
  { key: 'GENERAL', label: '일상' },
  { key: 'GATHER', label: '모임 모집' },
];

type SortType = 'LATEST' | 'POPULAR';

const SORT_OPTIONS: ReadonlyArray<{ value: SortType; label: string }> = [
  { value: 'LATEST', label: '최신순' },
  { value: 'POPULAR', label: '인기순' },
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
  const navigate = useNavigate();
  const [topTab, setTopTab] = useState<'community' | 'reading'>('community');
  const [category, setCategory] = useState<string>('ALL');
  const [sort, setSort] = useState<SortType>('LATEST');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

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

  const { data: boardPosts = [], isLoading } = useQuery(
    boardQueries.GET_BOARD_LIST({
      title: searchKeyword || undefined,
      category: category === 'ALL' ? undefined : category,
    })
  );

  const filteredPosts = useMemo(() => {
    if (sort === 'POPULAR') {
      return [...boardPosts].sort((a, b) => b.likeCount - a.likeCount);
    }
    return boardPosts;
  }, [boardPosts, sort]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const searchPlaceholder = topTab === 'community' ? '검색어를 입력해 주세요.' : '독서모임명으로 검색';

  return (
    <div>
      <UnderlineTab
        items={COMMUNITY_TABS}
        value={topTab}
        onChange={(k) => setTopTab(k as 'community' | 'reading')}
        className={cn('sticky', showFloatingSearch ? 'top-[6.5rem]' : 'top-0')}
      />

      {showFloatingSearch && (
        <div
          ref={floatingSearchRef}
          className={cn('bg-gray-white sticky top-0 z-[var(--z-header)]', 'px-[2rem] pt-[0.8rem] pb-[0.8rem]')}
        >
          <SearchBar placeholder={searchPlaceholder} onSubmit={handleSearch} />
        </div>
      )}

      <div className='px-[2rem] pt-[1.2rem]' ref={searchAnchorRef}>
        <SearchBar placeholder={searchPlaceholder} onSubmit={handleSearch} />
      </div>

      {topTab === 'community' ? (
        <>
          <div className='flex-col-center gap-[0.9rem]'>
            <PillTab items={CATEGORIES} value={category} onChange={setCategory} />
            <div className='flex-row-between w-full px-[2rem]'>
              <div className='flex py-[1.2rem]'>
                <span className='caption2 text-gray-900'>
                  총 <span className='text-primary-700'>{filteredPosts.length}개</span>
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

          {isLoading ? (
            <div className='body5 py-[4rem] text-center text-gray-500'>로딩 중...</div>
          ) : (
            <ul className='space-y-[0.1rem]'>
              {filteredPosts.length === 0 ? (
                <li className='body5 py-[4rem] text-center text-gray-500'>게시글이 없습니다.</li>
              ) : (
                filteredPosts.map((post) => (
                  <li key={post.id} className='bg-gray-white'>
                    <PostCard
                      title={post.title}
                      content=''
                      commentCount={post.commentCount}
                      likeCount={post.likeCount}
                      date={formatDate(post.createdAt)}
                      author={post.writerName}
                      onClick={() => navigate(`/board/${post.id}`)}
                    />
                  </li>
                ))
              )}
            </ul>
          )}
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
