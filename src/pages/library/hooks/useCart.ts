import { toast } from '@libs/toast';
import { modal } from '@libs/modal';
import { MODAL_TITLE } from '@constants/modal-presets';
import type { ILibraryBook } from '@pages/library/types/library.types';

const CART_STORAGE_KEY = 'library-cart';

interface CartData {
  library: string;
  books: ILibraryBook[];
}

export const useCart = () => {
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

  return {
    getCartData,
    addToCart,
  };
};
