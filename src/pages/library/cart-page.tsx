import { useEffect, useState } from 'react';
import EmptyState from '@components/empty/empty-state';
import CardLibraryBook from '@pages/library/components/card/card-library-book';
import Input from '@components/input/input';
import type { ILibraryBook } from '@pages/library/types/library.types';
import Divider from '@components/divider';
import Button from '@components/button/button';
import { useNavigate } from 'react-router-dom';

const CART_STORAGE_KEY = 'library-cart';

export default function CartPage() {
  const [cartBooks, setCartBooks] = useState<ILibraryBook[]>([]);
  const [dueDate, setDueDate] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem(CART_STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setCartBooks(parsed.books || []);
      } catch {
        setCartBooks([]);
      }
    }
  }, []);

  if (cartBooks.length === 0) {
    return (
      <div className='flex-row-center h-[calc(100vh-140px)]'>
        <EmptyState kind='cart' />
      </div>
    );
  }

  return (
    <div className='flex-col gap-[2rem] pt-[2rem]'>
      <div className='flex-col gap-[1rem] px-[2rem]'>
        {cartBooks.map((book) => (
          <CardLibraryBook key={book.id} book={book} isCart={false} />
        ))}
      </div>
      <div className='mb-[1rem] px-[2rem]'>
        <Input
          id='due-date'
          label='반납기한을 입력해 주세요.'
          placeholder='숫자만 입력해 주세요 (ex. 20)'
          value={dueDate}
          onChange={(e) => setDueDate(e.currentTarget.value)}
        />
      </div>
      <Divider />
      <div className='flex-col gap-[1.4rem] px-[3rem]'>
        <h1 className='caption1 text-gray-900'>최종 결제</h1>
        <div className='flex-col gap-[0.5rem]'>
          <div className='flex-row-between'>
            <span className='caption4 text-gray-900'>내 포인트</span>
            <span className='caption2 text-gray-900'>48000</span>
          </div>
          <div className='flex-row-between'>
            <span className='caption4 text-gray-900'>총 보증금</span>
            <span className='caption2 text-gray-900'>2000</span>
          </div>
        </div>
        <Divider />
        <div className='flex-row-between'>
          <h2 className='caption1 text-gray-900'>총 결제 금액</h2>
          <span className='body1 text-gray-900'>46000</span>
        </div>
      </div>
      <div className='px-[2rem]'>
        <Button fullWidth={true} onClick={() => nav('/chat/1')}>
          대여 요청
        </Button>
      </div>
    </div>
  );
}
