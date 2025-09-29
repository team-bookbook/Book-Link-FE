import { useEffect, useState } from 'react';
import type { IBookCard } from './types/home.types';
import { RESERVATION_NOTICE } from './constants/reservation-notice';
import { generateDummyBooks } from './hooks/use-home-data';
import BookCard from './components/card/book-card';

export default function MyReservationPage() {
  const ICON_CAUTION_GRAY = new URL('@icons/caution-gray.svg', import.meta.url).href;
  const [dummy, setDummy] = useState<IBookCard[]>([]);

  useEffect(() => {
    const response = generateDummyBooks(6);
    if (!response) return;
    setDummy(response);
  }, []);

  const renderNotice = () => (
    <div className='bg-secondary-100 flex-col gap-[1.2rem] rounded-[0.4rem] p-[1.6rem] text-gray-600'>
      <div className='flex-items-center gap-[0.4rem]'>
        <img src={ICON_CAUTION_GRAY} alt='info' className='h-[1.6rem] w-[1.6rem]' loading='lazy' />
        <h1 className='caption4'>{RESERVATION_NOTICE.title}</h1>
      </div>
      <ul className='caption5 dot flex-col gap-[0.4rem]'>
        {RESERVATION_NOTICE.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );

  const renderBookList = () => (
    <div className='flex-col gap-[1.5rem] pt-[2rem]'>
      <h2 className='title5 text-gray-900'>예약 도서 목록</h2>
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
    <div className='flex-col gap-[2rem]'>
      <div className='px-[2rem] pt-[2rem]'>
        {renderNotice()}
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
