import { useState } from 'react';
import LibraryTab, { type LibraryTabKey } from '@pages/library/components/library-tab';
import { useQueryTab } from '@hooks/use-query-tab';
import SelectDropdown from '@components/dropdown/select-dropdown';
import { toast } from '@libs/toast';
import Button from '@components/button/button';

import {
  LIB_SORT_OPTIONS,
  BOOK_SORT_OPTIONS,
  RENT_STATUS_OPTIONS,
  type LibSort,
  type BookSort,
  type RentStatus,
} from '@components/dropdown/constants/select-options';

export default function LibraryPage() {
  const [tab, setTab] = useQueryTab<LibraryTabKey>('tab', 'books', ['books', 'libraries']);

  return (
    <>
      <LibraryTab value={tab} onChange={setTab} />
      {tab === 'libraries' ? <LibraryList /> : <BookList />}
      <div className='flex-col gap-[1rem]'>
        <Button type='button' onClick={() => toast.info('이메일을 확인해 주세요.')}>
          Info
        </Button>
        <Button type='button' onClick={() => toast.success('로그인에 성공했습니다.')}>
          Success
        </Button>
        <Button type='button' onClick={() => toast.error('로그인에 실패했습니다.')}>
          Error
        </Button>
      </div>
    </>
  );
}

function LibraryList() {
  const [libSort, setLibSort] = useState<LibSort>('recent');
  const [rentStatus, setRentStatus] = useState<RentStatus>('pending');

  return (
    <div className='flex-col gap-[1.2rem]'>
      <div className='flex-row-between'>
        <div className='flex items-center gap-[1.2rem]'>
          <SelectDropdown
            triggerLabel={libSort === 'recent' ? '최신순' : libSort === 'distance' ? '거리순' : '인기순'}
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
    </div>
  );
}

function BookList() {
  const [bookSort, setBookSort] = useState<BookSort>('recent');

  return (
    <div className='flex-col gap-[1.2rem]'>
      <div className='flex-row-between'>
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
