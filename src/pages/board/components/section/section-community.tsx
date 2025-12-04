import { useNavigate } from 'react-router-dom';
import PostCard from '@pages/board/components/post-card';
import PillTab from '@components/tab/pill-tab';
import SelectDropdown from '@components/dropdown/select-dropdown';
import { useQuery } from '@tanstack/react-query';
import { boardQueries, type SortType } from '@apis/board/board-queries';
import { formatDate } from '@/shared/utils/formatDate';
import type { TabItem } from '@pages/board/board-page';

const CATEGORIES: TabItem[] = [
  { key: 'ALL', label: '전체' },
  { key: 'RECOMMEND', label: '책 추천' },
  { key: 'GENERAL', label: '일상' },
  { key: 'GATHER', label: '모임 모집' },
];

const SORT_OPTIONS: ReadonlyArray<{ value: SortType; label: string }> = [
  { value: 'LATEST', label: '최신순' },
  { value: 'POPULAR', label: '인기순' },
];

interface SectionCommunityProps {
  category: string;
  sort: SortType | '';
  searchKeyword: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: SortType) => void;
}

export default function SectionCommunity({
  category,
  sort,
  searchKeyword,
  onCategoryChange,
  onSortChange,
}: SectionCommunityProps) {
  const navigate = useNavigate();

  const { data: boardPosts = [], isLoading } = useQuery(
    boardQueries.GET_BOARD_LIST({
      title: searchKeyword || undefined,
      category: category === 'ALL' ? undefined : category,
    })
  );

  return (
    <>
      <div className='flex-col-center gap-[0.9rem]'>
        <PillTab items={CATEGORIES} value={category} onChange={onCategoryChange} />
        <div className='flex-row-between w-full px-[2rem]'>
          <div className='flex py-[1.2rem]'>
            <span className='caption2 text-gray-900'>
              총 <span className='text-primary-700'>{boardPosts.length}개</span>
            </span>
          </div>

          <SelectDropdown<SortType>
            value={sort}
            options={SORT_OPTIONS}
            onChange={onSortChange}
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
          {boardPosts.length === 0 ? (
            <li className='body5 py-[4rem] text-center text-gray-500'>게시글이 없습니다.</li>
          ) : (
            boardPosts.map((post) => (
              <li key={post.id} className='bg-gray-white'>
                <PostCard
                  title={post.title}
                  content={post.previewContent}
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
  );
}
