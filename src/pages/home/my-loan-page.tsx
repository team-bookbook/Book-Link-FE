import { useEffect, useState } from 'react';
import type { IBookCard } from './types/home.types';
import { generateDummyBooks } from './hooks/useHomeData';
import BookCard from './components/card/book-card';

export default function MyLoanPage() {
  const [dummy, setDummy] = useState<IBookCard[]>([]);

  useEffect(() => {
    const response = generateDummyBooks(6);
    if (!response) return;
    setDummy(response);
  }, []);

  const renderBookList = () => (
    <div className='flex-col gap-[1.5rem] pt-[2.5rem]'>
      <div className='grid grid-cols-2 gap-[2rem]'>
        {dummy.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            index={book.index}
            imgurl={book.imgurl}
            title={book.title}
            author={book.author}
            expDate={book.expDate}
            size='large'
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className='flex-col gap-[2rem] bg-gray-50'>
      <div className='px-[2rem]'>
        {dummy.length > 0 ? (
          renderBookList()
        ) : (
          <div className='flex-row-center py-[4rem]'>
            <span className='text-gray-500'>예약 내역이 없습니다.</span>
          </div>
        )}
      </div>
    </div>
  );
}
