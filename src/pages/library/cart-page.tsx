import { useEffect, useState } from 'react';
import EmptyState from '@components/empty/empty-state';
import LibraryBookCard from '@pages/library/components/card/library-book-card';
import Input from '@components/input/input';
import type { ILibraryBook } from '@pages/library/types/library.types';
import Divider from '@components/divider';
import Button from '@components/button/button';
import { useNavigate } from 'react-router-dom';
import { CART_STORAGE_KEY, CART_LABELS } from '@pages/library/constants/cart';
import { useMutation } from '@tanstack/react-query';
import { borrowMutations } from '@apis/borrow/borrow-mutations';

export default function CartPage() {
  const [cartBooks, setCartBooks] = useState<ILibraryBook[]>([]);
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();

  const createBorrowMutation = useMutation(borrowMutations.POST_BORROW());

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

  const formatExpectedReturnDate = (dateString: string): string => {
    if (!dateString) {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date.toISOString();
    }

    // YYYY-MM-DD 형식의 날짜를 ISO 8601 형식으로 변환
    const date = new Date(dateString);

    // Invalid Date 체크
    if (isNaN(date.getTime())) {
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 7);
      return fallbackDate.toISOString();
    }

    // 한국 시간대(KST, UTC+9) 기준으로 자정 시간 설정
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  };

  const handleRentalRequest = () => {
    if (cartBooks.length > 1) {
      console.log('장바구니에 2개 이상의 책이 있습니다. 현재는 1개만 대여 가능합니다.');
      console.log('장바구니 책 목록:', cartBooks);
      return;
    }

    if (cartBooks.length === 1) {
      const book = cartBooks[0];
      const formattedDate = formatExpectedReturnDate(dueDate);

      console.log('대여 요청 데이터:', {
        libraryBookId: book.id,
        expectedReturnDate: formattedDate,
        chatId: 'eb51eb2f-0d34-4303-a9f9-f37ddf21555f',
      });

      createBorrowMutation.mutate(
        {
          libraryBookId: book.id,
          expectedReturnDate: formattedDate,
          chatId: 'eb51eb2f-0d34-4303-a9f9-f37ddf21555f',
        },
        {
          onSuccess: (data) => {
            console.log('대여 성공:', data);
            navigate('/chat/1');
          },
          onError: (error) => {
            console.error('대여 실패:', error);
          },
        }
      );
    }
  };

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
        <Button fullWidth={true} onClick={handleRentalRequest} disabled={createBorrowMutation.isPending}>
          {createBorrowMutation.isPending ? '대여 중...' : CART_LABELS.rentalRequest}
        </Button>
      </div>
    </div>
  );
}
