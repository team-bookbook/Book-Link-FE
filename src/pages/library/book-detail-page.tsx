import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Divider from '@components/divider';
import Icon from '@components/icon';
import type { IBookDetail } from '@pages/library/types/library.types';
import Button from '@components/button/button';
import { BOOK_DETAIL_LABELS } from '@pages/library/constants/book-detail';

export default function BookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<IBookDetail | null>(null);
  const nav = useNavigate();
  // const { addToCart } = useCart();

  useEffect(() => {
    const mockBook: IBookDetail = {
      id: Number(bookId),
      title: '1Q84',
      author: '무라카미 하루키',
      publisher: '민음사',
      library: 'OO 도서관',
      maxDays: 30,
      deposit: 500,
      status: 'available',
      genre: '소설',
      price: 12200,
      description: '책 관련 상세 설명 내용이 작성되는 칸\n또는, 사용자가 도서 규칙에 관해 자유롭게 작성할 수 있는 칸',
      imgUrl: undefined,
    };
    setBook(mockBook);
  }, [bookId]);

  const handleCartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (book) {
      // await addToCart({
      //   id: String(book.id),
      //   title: book.title,
      //   author: book.author,
      //   library: book.library,
      //   dueDate: new Date(Date.now() + book.maxDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      //   maxDays: book.maxDays,
      //   deposit: book.deposit,
      //   status: book.status,
      //   imgUrl: book.imgUrl,
      // });
    }
  };

  if (!book) {
    return;
  }

  const bookDetailHeader = () => {
    return (
      <div className='flex-col gap-[0.8rem] px-[2rem]'>
        <div className='flex'>
          <Icon name='location' size={1.6} />
          <span className='caption5 text-gray-600'>{book.library}</span>
        </div>
        <h1 className='title3 text-gray-900'>{book.title}</h1>
        <span className='flex-items-center gap-[0.5rem]'>
          <h2 className='body5 text-gray-600'>{book.author}</h2>
          <span className='flex-row-center caption5 bg-gray-100 px-[0.7rem] text-gray-600'>{book.publisher}</span>
        </span>
        <span className='flex-items-center caption5 gap-[0.5rem] text-gray-600'>
          <p>
            {BOOK_DETAIL_LABELS.maxDays} {book.maxDays}
            {BOOK_DETAIL_LABELS.maxDaysUnit}
          </p>
          <p>|</p>
          <p>
            {BOOK_DETAIL_LABELS.deposit} {book.deposit}
            {BOOK_DETAIL_LABELS.depositUnit}
          </p>
        </span>
      </div>
    );
  };

  const bookDetailDescription = () => {
    return (
      <div className='flex-col gap-[2rem] px-[2rem]'>
        <div className='caption5 max-w-[8.5rem] flex-col gap-[1rem] text-gray-800'>
          {book.genre && (
            <div className='flex-row-between caption5'>
              <span>{BOOK_DETAIL_LABELS.genre}</span>
              <span>{book.genre}</span>
            </div>
          )}
          {book.price && (
            <div className='flex-row-between caption5'>
              <span>{BOOK_DETAIL_LABELS.price}</span>
              <span>{book.price}</span>
            </div>
          )}
        </div>
        {book.description && (
          <div className='caption5 text-gray-900' style={{ whiteSpace: 'pre-line' }}>
            {book.description}
          </div>
        )}
        <div className='flex-col gap-[1rem]'>
          <h2 className='caption2 text-gray-800'>{BOOK_DETAIL_LABELS.mapTitle}</h2>
          <div className='min-h-[33.5rem] max-w-[43rem] min-w-[33.5rem] bg-gray-100'></div>
        </div>
      </div>
    );
  };

  const bottomBar = () => {
    return (
      <div className='bg-gray-white shadow-bottom-fixed fixed bottom-0 left-1/2 z-50 w-full max-w-[43rem] -translate-x-1/2 px-[2rem] pt-[1.2rem] pb-[2.5rem]'>
        <Button fullWidth={true} onClick={() => nav('/chat/1')}>
          {BOOK_DETAIL_LABELS.rentalRequest}
        </Button>
      </div>
    );
  };

  return (
    <div className='flex-col gap-[2rem]'>
      <div className='flex-row-center relative min-h-[26.2rem] bg-gray-100'>
        {book.imgUrl ? (
          <img src={book.imgUrl} alt={book.title} className='h-full w-full object-cover' />
        ) : (
          <div className='flex h-full w-full items-center justify-center'>
            <Icon name='logo-alt' size={6} className='text-gray-400' />
          </div>
        )}
        <button
          onClick={handleCartClick}
          className='flex-row-center absolute right-[1rem] bottom-[1rem] z-1 min-h-[3.2rem] min-w-[3.2rem] cursor-pointer rounded-[8px] bg-gray-50'
          aria-label={BOOK_DETAIL_LABELS.addToCart}
        >
          <Icon name='cart-bag' size={2} className='text-gray-800'></Icon>
        </button>
      </div>
      {bookDetailHeader()}
      <Divider />
      {bookDetailDescription()}
      {bottomBar()}
    </div>
  );
}
