import { useEffect, useState } from 'react';
import EmptyState from '@components/empty/empty-state';
import LibraryBookCard from '@pages/library/components/card/library-book-card';
import Input from '@components/input/input';
import type { ILibraryBook } from '@pages/library/types/library.types';
import Divider from '@components/divider';
import Button from '@components/button/button';
import { useNavigate } from 'react-router-dom';
import { CART_STORAGE_KEY, CART_LABELS } from '@pages/library/constants/cart';

export default function CartPage() {
  const [cartBooks, setCartBooks] = useState<ILibraryBook[]>([]);
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();

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
          <LibraryBookCard key={book.id} book={book} isCart={false} />
        ))}
      </div>
      <div className='mb-[1rem] px-[2rem]'>
        <Input
          id='due-date'
          label={CART_LABELS.dueDate}
          placeholder={CART_LABELS.dueDatePlaceholder}
          value={dueDate}
          onChange={(e) => setDueDate(e.currentTarget.value)}
        />
      </div>
      <Divider />
      <div className='flex-col gap-[1.4rem] px-[3rem]'>
        <h1 className='caption1 text-gray-900'>{CART_LABELS.finalPayment}</h1>
        <div className='flex-col gap-[0.5rem]'>
          <div className='flex-row-between'>
            <span className='caption4 text-gray-900'>{CART_LABELS.myPoint}</span>
            <span className='caption2 text-gray-900'>48000</span>
          </div>
          <div className='flex-row-between'>
            <span className='caption4 text-gray-900'>{CART_LABELS.totalDeposit}</span>
            <span className='caption2 text-gray-900'>2000</span>
          </div>
        </div>
        <Divider />
        <div className='flex-row-between'>
          <h2 className='caption1 text-gray-900'>{CART_LABELS.totalPayment}</h2>
          <span className='body1 text-gray-900'>46000</span>
        </div>
      </div>
      <div className='px-[2rem]'>
        <Button fullWidth={true} onClick={() => navigate('/chat/1')}>
          {CART_LABELS.rentalRequest}
        </Button>
      </div>
    </div>
  );
}
