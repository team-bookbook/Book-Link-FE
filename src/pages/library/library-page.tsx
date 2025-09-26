import { useState } from 'react';
import LibraryTab, { type LibraryTabKey } from '@pages/library/components/library-tab';
import { useQueryTab } from '@hooks/use-query-tab';
import Input from '@components/input/input';
import SelectDropdown from '@components/dropdown/select-dropdown';

type LibSort = 'distance' | 'recent' | 'popular';
type BookSort = 'recent' | 'popular';
type RentStatus = 'pending' | 'confirmed' | 'stopped';

const LIB_SORT_OPTIONS: ReadonlyArray<{ value: LibSort; label: string }> = [
  { value: 'distance', label: '거리순' },
  { value: 'recent', label: '최신순' },
  { value: 'popular', label: '인기순' },
];

const BOOK_SORT_OPTIONS: ReadonlyArray<{ value: BookSort; label: string }> = [
  { value: 'recent', label: '최신순' },
  { value: 'popular', label: '인기순' },
];

const RENT_STATUS_OPTIONS: ReadonlyArray<{ value: RentStatus; label: string }> = [
  { value: 'pending', label: '대여 대기' },
  { value: 'confirmed', label: '대여 확정' },
  { value: 'stopped', label: '대여 중단' },
];

export default function LibraryPage() {
  const [tab, setTab] = useQueryTab<LibraryTabKey>('tab', 'books', ['books', 'libraries']);

  return (
    <>
      <LibraryTab value={tab} onChange={setTab} />
      {tab === 'libraries' ? <LibraryList /> : <BookList />}
    </>
  );
}

function LibraryList() {
  const [desc, setDesc] = useState('');
  const [libSort, setLibSort] = useState<LibSort>('distance');
  const [rentStatus, setRentStatus] = useState<RentStatus>('pending');

  const max = 200;

  return (
    <div className='flex-col gap-[1.2rem]'>
      {/* 상단 필터 영역: 정렬(title variant) + 상태(chip variant) */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-[1.2rem]'>
          <SelectDropdown
            triggerLabel={libSort === 'distance' ? '거리순' : libSort === 'recent' ? '최신순' : '인기순'}
            value={libSort}
            onChange={setLibSort}
            options={LIB_SORT_OPTIONS}
            variant='title'
            align='start'
          />
        </div>

        <SelectDropdown
          variant='chip'
          value={rentStatus}
          onChange={setRentStatus}
          options={RENT_STATUS_OPTIONS}
          align='end'
          menuWidthRem={12}
        />
      </div>

      {/* 메모 입력 */}
      <div className='flex-col gap-6'>
        <Input
          id='lib-desc'
          label='도서관 메모'
          multiline
          placeholder='도서관에 대한 메모를 입력하세요.'
          value={desc}
          onChange={(e) => setDesc(e.currentTarget.value)}
          maxLength={max}
          hasLength
          length={desc.length}
          defaultMessage='최대 200자까지 입력할 수 있어요.'
        />
      </div>

      {/* TODO: 리스트 영역 (API 연동 시 libSort, rentStatus 사용) */}
      <div className='mt-[1.2rem]'>{/* 리스트 컴포넌트 자리 */}</div>
    </div>
  );
}

function BookList() {
  const [keyword, setKeyword] = useState('');
  const [bookSort, setBookSort] = useState<BookSort>('recent');

  return (
    <div className='flex-col gap-[1.2rem]'>
      <div className='flex-row-between'>
        <Input
          id='book-search'
          label='도서 검색'
          placeholder='제목/저자를 입력하세요.'
          value={keyword}
          onChange={(e) => setKeyword(e.currentTarget.value)}
        />
        <SelectDropdown
          triggerLabel={bookSort === 'recent' ? '최신순' : '인기순'}
          value={bookSort}
          onChange={setBookSort}
          options={BOOK_SORT_OPTIONS}
          variant='title'
          align='end'
        />
      </div>
    </div>
  );
}
