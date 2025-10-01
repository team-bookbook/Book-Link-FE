import LibraryBookCard from '@pages/library/components/card/library-book-card';
import { useLibraryBooks } from '@pages/library/hooks/useLibraryBooks';

export default function LibraryBookPage() {
  const { books, isLoading } = useLibraryBooks();

  if (isLoading) {
    return (
      <div className='flex-col gap-[1rem] px-[2rem] pt-[3rem]'>
        <div className='flex-col gap-[1rem]'>
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className='h-[13.8rem] animate-pulse rounded-[1rem] bg-gray-200'></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='flex-col gap-[1rem] px-[2rem] pt-[3rem]'>
      <div className='flex-col gap-[1rem]'>
        {books.map((book) => (
          <LibraryBookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
