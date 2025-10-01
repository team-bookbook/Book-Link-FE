import { useEffect, useState } from 'react';
import type { IBookCard } from '@pages/home/types/home.types';
import { RESERVATION_NOTICE } from '@pages/home/constants/reservation-notice';
import { generateDummyBooks } from '@pages/home/hooks/useHomeData';
import BookCard from '@pages/home/components/card/book-card';
import Icon from '@components/icon';

export default function ReservationPage() {
  const [dummy, setDummy] = useState<IBookCard[]>([]);

  useEffect(() => {
    const response = generateDummyBooks(6);
    if (!response) return;
    setDummy(response);
  }, []);

  const renderNotice = () => (
    <div className='bg-secondary-100 flex-col gap-[1.2rem] rounded-[0.4rem] p-[1.6rem] text-gray-600'>
      <div className='flex-items-center gap-[0.4rem]'>
        <Icon name='caution' className='text-gray-600' size={1.6} />

        <h1 className='caption4'>{RESERVATION_NOTICE.title}</h1>
      </div>
      <ul className='caption5 dot list-inside list-disc flex-col gap-[0.4rem] indent-2'>
        {RESERVATION_NOTICE.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );

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
      <div className='p-[2rem]'>
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
