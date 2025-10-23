import { useState } from 'react';
import Icon from '@components/icon';
import SelectBottomSheet from '@components/bottom-sheet/select-bottom-sheet';
import useBottomSheet from '@components/bottom-sheet/hooks/use-bottom-sheet';
import { BOOK_CATEGORY_OPTIONS } from '@components/dropdown/constants/select-options';
import SearchBar from '@components/search-bar';

export default function LibraryBookPage() {
  const { isOpen, open, close } = useBottomSheet();
  const [selectCategory, setSelectCategory] = useState<string>('all');

  return (
    <div className='flex-col gap-[1rem] px-[2rem] pt-[1.5rem]'>
      <SearchBar placeholder={'검색어를 입력해 주세요.'} />
      <button onClick={open} className='body4 flex cursor-pointer items-center gap-[0.4rem] self-end text-gray-900'>
        <span>{BOOK_CATEGORY_OPTIONS.find((opt) => opt.value === selectCategory)?.label}</span>
        <Icon name='dropdown' size={1.2} />
      </button>
      <div className='flex-col gap-[1rem]'>
        {/* {books.map((book) => (
          <LibraryBookCard key={book.id} book={book} />
        ))} */}
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
