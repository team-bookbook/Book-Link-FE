import { libraryQueries } from '@apis/library/library-queries';
import Icon from '@components/icon';
import { useQuery } from '@tanstack/react-query';

interface LibraryRatingProps {
  libraryId: string;
}

export default function LibraryRating({ libraryId }: LibraryRatingProps) {
  const { data: reviewAvg } = useQuery(libraryQueries.GET_LIBRARY_REVIEW_AVG(libraryId));

  if (!reviewAvg) return;

  const onFavoriteClick = () => {
    console.log('helloWorld');
  };

  const stars = '★'.repeat(reviewAvg);

  return (
    <div className='flex-row-between'>
      <div className='flex-items-center gap-[1rem]'>
        <h1 className='title1'>{reviewAvg}</h1>
        <h2 className='caption1'>30개</h2>
        <span className='text-system-error ml-[0.5rem] text-[1.6rem]'>{stars}</span>
      </div>
      <button
        onClick={onFavoriteClick}
        className='flex-items-center cursor-pointer flex-col gap-[0.4rem]'
        type='button'
      >
        <Icon name='heart' className='text-system-error' size={2.4} aria-label='즐겨찾기 버튼' />
        <h2 className='caption2 text-gray-white'>32</h2>
      </button>
    </div>
  );
}
