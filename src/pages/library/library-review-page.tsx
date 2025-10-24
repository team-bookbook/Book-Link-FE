import { libraryQueries } from '@apis/library/library-queries';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ReviewCard from './components/card/libary-reivew-card';

export default function LibraryReviewPage() {
  const { id: libraryId } = useParams<{ id: string }>();
  const { data } = useQuery(libraryQueries.GET_LIBRARY_REVIEW(libraryId || ''));

  // const handleFavoriteClick = () => {
  //   console.log('즐겨찾기 버튼 클릭');
  // };

  if (!data || data.length === 0) {
    return <div className='flex items-center justify-center p-[3rem]'>아직 작성된 리뷰가 없습니다.</div>;
  }

  return (
    <div className='flex-col gap-[2rem] px-[2rem] pt-[3rem]'>
      {/* <LibraryRatingSection
        rating={libraryInfo.rating}
        reviewCount={libraryInfo.reviewCount}
        favoriteCount={libraryInfo.favoriteCount}
        onFavoriteClick={handleFavoriteClick}
      /> */}
      <div className='flex-col gap-[2rem]'>
        {data.map((review) => (
          <ReviewCard key={review.reviewId} review={review} />
        ))}
      </div>
    </div>
  );
}
