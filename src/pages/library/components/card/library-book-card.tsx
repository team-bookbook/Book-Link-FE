import Icon from '@components/icon';
import type { ILibraryBook, BookStatus } from '@pages/library/types/library.types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';
import { useCart } from '@pages/library/hooks/useCart';

interface LibraryBookCardProps {
  book: ILibraryBook;
  isCart?: boolean;
}

const getStatusInfo = (status: BookStatus) => {
  switch (status) {
    case 'BORROWED':
      return { text: '대여 중', color: 'text-system-error' };
    case 'RESERVED':
      return { text: '예약 중', color: 'text-gray-600' };
    case 'RESERVABLE':
      return { text: '예약가능', color: 'text-gray-600' };
    default:
      return { text: '대여가능', color: 'text-gray-600' };
  }
};

export default function LibraryBookCard({ book, isCart = true }: LibraryBookCardProps) {
  const status: BookStatus = book.rentedOut ? 'RESERVED' : 'AVAILABLE';
  const statusInfo = getStatusInfo(status);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleCartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(book);
  };

  const handleCardClick = () => {
    navigate(ROUTES.BOOK_DETAIL(book.id.toString()));
  };

  return (
    <div
      onClick={handleCardClick}
      className='flex-items-center relative min-h-[13.8rem] w-full cursor-pointer gap-[1rem] rounded-[10px] bg-gray-50 px-[1.4rem]'
    >
      <div
        className={`caption5 flex-row-center px-[0.7rem] ${statusInfo.color} absolute top-[2rem] right-[1.5rem] min-h-[1.7rem] min-w-[4.8rem] rounded-[2px] bg-gray-100`}
      >
        {statusInfo.text}
      </div>
      <div className='relative h-[10rem] w-[10rem] overflow-hidden bg-gray-50'>
        {isCart && (
          <button
            onClick={handleCartClick}
            className='flex-row-center absolute right-[0.5rem] bottom-[0.5rem] z-1 min-h-[3.2rem] min-w-[3.2rem] cursor-pointer rounded-[8px] bg-gray-50'
            aria-label='장바구니에 담기'
          >
            <Icon name='cart-bag' size={2} className='text-gray-800'></Icon>
          </button>
        )}

        {book.imageUrl ? (
          <img src={book.imageUrl} alt={book.title} className='h-full w-full object-cover' />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gray-200'>
            <Icon name='logo-alt' size={3.6} className='text-gray-400' />
          </div>
        )}
      </div>
      <div className='flex-col gap-[2.2rem]'>
        <div className='flex-col gap-[0.2rem]'>
          <h1 className='title6'>{book.title}</h1>
          <div className='flex gap-[1rem]'>
            <h2 className='caption5 text-gray-600'>{book.author}</h2>
            <span className='flex'>
              <Icon name='location' size={1.6} className='text-primary-700' />
              <h2 className='caption5 text-gray-600'>{book.libraryName}</h2>
            </span>
          </div>
        </div>
        <div className='flex-col gap-[0.3rem]'>
          <p className='flex-row-center caption5 max-w-[7.4rem] rounded-[2px] bg-gray-100 text-gray-600'>
            {book.expectedReturnDate}
          </p>
          <h3 className='caption5 flex gap-[0.5rem] text-gray-600'>
            <span>거리 {Math.floor(book.distance)}m</span>
            <span>|</span>
            <span>보증금 {book.deposit}p</span>
          </h3>
        </div>
      </div>
    </div>
  );
}
