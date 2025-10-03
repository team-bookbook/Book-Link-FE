import { useState } from 'react';
import Icon from '@components/icon';
import SelectBottomSheet from '@components/bottom-sheet/select-bottom-sheet';
import useBottomSheet from '@components/bottom-sheet/hooks/use-bottom-sheet';
import LibraryBookCard from '@pages/library/components/card/library-book-card';
import { useLibraryBooks } from '@pages/library/hooks/useLibraryBooks';
import { BOOK_CATEGORY_OPTIONS, type BookCategory } from '@components/dropdown/constants/select-options';

export default function LibraryBookPage() {
  const { books, isLoading } = useLibraryBooks();
  const { isOpen, open, close } = useBottomSheet();
  const [selectCategory, setSelectCategory] = useState<BookCategory>('all');

  if (isLoading) {
    return (
      <div className='flex-col gap-[1rem] px-[2rem] pt-[3rem]'>
        <div className='flex-col gap-[1rem]'>
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className='h-[13.8rem] animate-pulse rounded-[10px] bg-gray-200'></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='flex-col gap-[1rem] px-[2rem] pt-[3rem]'>
      <button onClick={open} className='body4 flex cursor-pointer items-center gap-[0.4rem] self-end text-gray-900'>
        <span>{BOOK_CATEGORY_OPTIONS.find((opt) => opt.value === selectCategory)?.label}</span>
        <Icon name='dropdown' size={1.2} />
      </button>
      <div className='flex-col gap-[1rem]'>
        {books.map((book) => (
          <LibraryBookCard key={book.id} book={book} />
        ))}
      </div>
      <SelectBottomSheet
        open={isOpen}
        onClose={close}
        options={BOOK_CATEGORY_OPTIONS}
        value={selectCategory}
        onChange={setSelectCategory}
      />
    </div>
  );
}
