import LibraryRatingSection from '@pages/library/components/section/section-library-rating';
import ReviewCard from '@pages/library/components/card/libary-reivew-card';
import { useLibraryDetailData } from '@pages/library/hooks/useLibraryDetailData';

export default function LibraryReviewPage() {
  const { libraryInfo, reviewData, isLoadingLibraryInfo, isLoadingReviews } = useLibraryDetailData();

  const handleFavoriteClick = () => {
    console.log('즐겨찾기 버튼 클릭');
  };

  if (isLoadingLibraryInfo || isLoadingReviews) {
    return (
      <div className='flex-col gap-[2rem] px-[2rem] pt-[3rem]'>
        <div className='h-[6rem] animate-pulse rounded-[1rem] bg-gray-200'></div>
        <div className='flex-col gap-[2rem]'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className='h-[10rem] animate-pulse rounded-[1rem] bg-gray-200'></div>
          ))}
        </div>
      </div>
    );
  }

  if (!libraryInfo) return null;

  return (
    <div className='flex-col gap-[2rem] px-[2rem] pt-[3rem]'>
      <LibraryRatingSection
        rating={libraryInfo.rating}
        reviewCount={libraryInfo.reviewCount}
        favoriteCount={libraryInfo.favoriteCount}
        onFavoriteClick={handleFavoriteClick}
      />
      <div className='flex-col gap-[2rem]'>
        {reviewData.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
