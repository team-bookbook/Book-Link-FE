import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Divider from '@components/divider';
import Icon from '@components/icon';
import type { IBookDetail } from '@pages/library/types/library.types';
import Button from '@components/button/button';
import { BOOK_DETAIL_LABELS } from '@pages/library/constants/book-detail';
import { libraryBookQueries } from '@apis/library/library-book-queries';
import LoadingSpinner from '@components/loading-spinner';

export default function BookDetailPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const bookId = params.id;

  console.log('BookDetailPage - params:', params, 'bookId:', bookId);

  const {
    data: bookDetail,
    isLoading,
    error,
  } = useQuery({
    ...libraryBookQueries.GET_LIBRARY_BOOK_DETAIL(bookId!),
    enabled: !!bookId,
  });

  const handleCartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (isLoading) {
    return (
      <div className='flex-row-center min-h-screen'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !bookDetail) {
    return;
  }

  const { libraryDto, libraryBookDetailDto, bookDetailDto } = bookDetail;

  const book: IBookDetail = {
    id: parseInt(libraryBookDetailDto.id) || 0,
    title: bookDetailDto.title,
    author: bookDetailDto.author,
    publisher: bookDetailDto.publisher,
    library: libraryDto.name,
    maxDays: 14, // TODO: API에서 제공하지 않는 필드, 기본값 설정
    deposit: libraryBookDetailDto.deposit,
    status: libraryBookDetailDto.status,
    imgUrl: libraryBookDetailDto.previewImages ? JSON.parse(libraryBookDetailDto.previewImages)[0] : undefined,
    genre: bookDetailDto.category,
    price: bookDetailDto.originalPrice,
    description: undefined, // TODO: API에서 제공하지 않는 필드
    latitude: libraryDto.latitude,
    longitude: libraryDto.longitude,
  };

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
        <div className='caption5 max-w-[12rem] flex-col gap-[1rem] text-gray-800'>
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
        <Button fullWidth={true} onClick={() => navigate('/chat/1')}>
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
