import { BOOK_SORT_OPTIONS, type BookSort } from '@components/dropdown/constants/select-options';
import SelectDropdown from '@components/dropdown/select-dropdown';
import Icon from '@components/icon';
import { useState, useMemo } from 'react';
import CardLibraryBook from '../card/card-library-book';
import { useLibraryData } from '../../hooks/useLibraryData';

export default function BookList() {
  const [bookSort, setBookSort] = useState<BookSort>('recent');
  const { books, isLoading } = useLibraryData();

  const sortedBooks = useMemo(() => {
    if (!books.length) return [];

    return [...books].sort((a, b) => {
      if (bookSort === 'recent') {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  }, [books, bookSort]);

  const BookListOptions = () => {
    return (
      <div className='flex-row-between px-[1.5rem]'>
        <div className='flex-row-center min-h-[4.8rem] cursor-pointer gap-[0.2rem]'>
          <Icon name='location' size={2.4} className='text-primary-700' />
          <span className='caption1'>서울시 용산구</span>
          <Icon name='dropdown' size={1.2} ariaHidden />
        </div>
        <SelectDropdown
          triggerLabel={bookSort === 'recent' ? '최신순' : '인기순'}
          value={bookSort}
          onChange={setBookSort}
          options={BOOK_SORT_OPTIONS}
          variant='title'
          align='end'
        />
      </div>
    );
  };

  return (
    <div className='flex-col gap-[0.4rem] pt-[0.4rem]'>
      {BookListOptions()}
      <div className='flex-col gap-[1rem] px-[2rem]'>
        {isLoading ? (
          <div className='text-center'>로딩 중...</div>
        ) : sortedBooks.length > 0 ? (
          sortedBooks.map((book) => <CardLibraryBook key={book.id} book={book} />)
        ) : (
          <div className='text-center text-gray-500'>대출할 수 있는 책이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
