import Icon from '@components/icon';
import { toast } from '@libs/toast';
import type { ILibraryBook, BookStatus } from '../../types/library.types';
import { modal } from '@libs/modal';
import { MODAL_TITLE } from '@constants/modal-presets';

interface CardLibraryBookProps {
  book: ILibraryBook;
  isCart?: boolean;
}

const CART_STORAGE_KEY = 'library-cart';

const getStatusInfo = (status: BookStatus) => {
  switch (status) {
    case 'rented':
      return { text: '대여 중', color: 'text-system-error' };
    case 'reserved':
      return { text: '예약 중', color: 'text-gray-600' };
    case 'available':
      return { text: '대여가능', color: 'text-gray-600' };
    default:
      return { text: '대여가능', color: 'text-gray-600' };
  }
};

interface CartData {
  library: string;
  books: ILibraryBook[];
}

const getCartData = (): CartData | null => {
  try {
    const data = sessionStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const saveCartData = (data: CartData) => {
  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
};

const addToCart = async (book: ILibraryBook): Promise<boolean> => {
  const currentCart = getCartData();

  if (!currentCart) {
    saveCartData({ library: book.library, books: [book] });
    toast.success('장바구니에 담았습니다.');
    return true;
  }

  if (currentCart.library !== book.library) {
    const res = await modal.confirm({
      title: MODAL_TITLE.CART_REPLACE,
      confirmVariant: 'danger',
    });
    if (res.ok) {
      saveCartData({ library: book.library, books: [book] });
      toast.info('기존 도서를 비우고 담았어요.');
    }
    return true;
  }

  if (currentCart.books.some((b) => b.id === book.id)) {
    toast.info('이미 장바구니에 있는 도서에요.');
    return true;
  }

  currentCart.books.push(book);
  saveCartData(currentCart);
  toast.success('장바구니에 담았습니다.');
  return true;
};

export default function CardLibraryBook({ book, isCart = true }: CardLibraryBookProps) {
  const statusInfo = getStatusInfo(book.status);

  const handleCartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(book);
  };

  return (
    <div className='flex-items-center relative min-h-[13.8rem] w-full cursor-pointer gap-[1rem] rounded-[1rem] bg-gray-50 px-[1.4rem]'>
      <div
        className={`caption5 flex-row-center px-[0.7rem] ${statusInfo.color} absolute top-[2rem] right-[1.5rem] min-h-[1.7rem] min-w-[4.8rem] rounded-[0.2rem] bg-gray-100`}
      >
        {statusInfo.text}
      </div>
      <div className='relative h-[10rem] w-[10rem] overflow-hidden bg-green-50'>
        {isCart && (
          <button
            onClick={handleCartClick}
            className='flex-row-center absolute right-[0.5rem] bottom-[0.5rem] z-1 min-h-[3.2rem] min-w-[3.2rem] cursor-pointer rounded-[0.8rem] bg-gray-50'
            aria-label='장바구니에 담기'
          >
            <Icon name='cart-bag' size={2} className='text-gray-800'></Icon>
          </button>
        )}

        {book.imgUrl ? (
          <img src={book.imgUrl} alt={book.title} className='h-full w-full object-cover' />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gray-200'>
            <Icon name='logo-alt' size={2.4} className='text-gray-400' />
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
              <h2 className='caption5 text-gray-600'>{book.library}</h2>
            </span>
          </div>
        </div>
        <div className='flex-col gap-[0.3rem]'>
          <p className='flex-row-center caption5 max-w-[7.4rem] rounded-[0.2rem] bg-gray-100 text-gray-600'>
            {book.dueDate}
          </p>
          <h3 className='caption5 flex gap-[0.5rem] text-gray-600'>
            <span>최대 반납기한 {book.maxDays}일</span>
            <span>|</span>
            <span>보증금 {book.deposit}p</span>
          </h3>
        </div>
      </div>
    </div>
  );
}
