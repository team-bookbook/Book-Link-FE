import { libraryQueries } from '@apis/library/library-queries';
import { useQuery } from '@tanstack/react-query';
import LibraryLike from './section-library-like';

interface LibraryRatingProps {
  libraryId: string;
  likeCount?: number;
  isLiked?: boolean;
}

export default function LibraryRating({ libraryId, likeCount, isLiked }: LibraryRatingProps) {
  const { data: reviewAvg } = useQuery(libraryQueries.GET_LIBRARY_REVIEW_AVG(libraryId));

  const stars = '★'.repeat(Math.floor(reviewAvg ? reviewAvg : 0));

  return (
    <div className='flex-row-between'>
      <div className='flex-items-center gap-[1rem]'>
        <h1 className='title1'>{reviewAvg ? reviewAvg.toFixed(1) : 0}</h1>
        <h2 className='caption1'>30개</h2>
        <span className='text-system-error ml-[0.5rem] text-[1.6rem]'>{stars}</span>
      </div>
      <LibraryLike libraryId={libraryId} likeCount={likeCount} isLiked={isLiked} />
    </div>
  );
}
