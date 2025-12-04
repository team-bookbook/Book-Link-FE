import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '@components/search-bar';
import UnderlineTab from '@components/tab/underline-tab';
import { cn } from '@libs/cn';
import type { SortType } from '@apis/board/board-queries';
import SectionCommunity from '@pages/board/components/section/section-community';
import SectionReading from '@pages/board/components/section/section-reading';

export type TabItem = { key: string; label: string };

const COMMUNITY_TABS: TabItem[] = [
  { key: 'community', label: '커뮤니티' },
  { key: 'reading', label: '독서 모임' },
];

export default function BoardPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const topTab = (searchParams.get('tab') as 'community' | 'reading') || 'community';
  const category = searchParams.get('category') || 'ALL';
  const sort = (searchParams.get('sort') as SortType) || '';
  const communitySearch = searchParams.get('communitySearch') || '';
  const readingSearch = searchParams.get('readingSearch') || '';

  const searchAnchorRef = useRef<HTMLDivElement | null>(null);
  const floatingSearchRef = useRef<HTMLDivElement | null>(null);
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);

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

  useEffect(() => {
    const el = searchAnchorRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShowFloatingSearch(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleTabChange = (tab: string) => {
    updateParams({ tab });
  };

  const handleCategoryChange = (cat: string) => {
    updateParams({ category: cat });
  };

  const handleSortChange = (s: SortType) => {
    updateParams({ sort: s });
  };

  const handleSearch = (keyword: string) => {
    if (topTab === 'community') {
      updateParams({ communitySearch: keyword });
    } else {
      updateParams({ readingSearch: keyword });
    }
  };

  const searchPlaceholder = topTab === 'community' ? '검색어를 입력해 주세요.' : '독서모임명으로 검색';
  const currentSearchValue = topTab === 'community' ? communitySearch : readingSearch;

  return (
    <div>
      <UnderlineTab
        items={COMMUNITY_TABS}
        value={topTab}
        onChange={handleTabChange}
        className={cn('sticky', showFloatingSearch ? 'top-[6.5rem]' : 'top-0')}
      />

      {showFloatingSearch && (
        <div
          ref={floatingSearchRef}
          className={cn('bg-gray-white sticky top-0 z-[var(--z-header)]', 'px-[2rem] pt-[0.8rem] pb-[0.8rem]')}
        >
          <SearchBar
            key={`floating-${topTab}`}
            placeholder={searchPlaceholder}
            onSubmit={handleSearch}
            defaultValue={currentSearchValue}
          />
        </div>
      )}

      <div className='px-[2rem] pt-[1.2rem]' ref={searchAnchorRef}>
        <SearchBar
          key={`anchor-${topTab}`}
          placeholder={searchPlaceholder}
          onSubmit={handleSearch}
          defaultValue={currentSearchValue}
        />
      </div>

      {topTab === 'community' ? (
        <SectionCommunity
          category={category}
          sort={sort}
          searchKeyword={communitySearch}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
        />
      ) : (
        <SectionReading searchKeyword={readingSearch} />
      )}
    </div>
  );
}
