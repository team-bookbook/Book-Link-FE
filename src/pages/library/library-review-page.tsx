import { libraryQueries } from '@apis/library/library-queries';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ReviewCard from './components/card/libary-reivew-card';
import LibraryRating from './components/section/section-library-rating';
import { memberQueries } from '@apis/member/member-queries';
import { isAuthenticated } from '@/shared/utils/auth';

export default function LibraryReviewPage() {
  const { id: libraryId } = useParams<{ id: string }>();
  const { data: reviewData } = useQuery(libraryQueries.GET_LIBRARY_REVIEW(libraryId || ''));
  const { data: memberData } = useQuery({
    ...memberQueries.GET_ME(),
    enabled: isAuthenticated(),
  });

  if (!reviewData || reviewData.length === 0) {
    return <div className='flex items-center justify-center p-[3rem]'>아직 작성된 리뷰가 없습니다.</div>;
  }

  return (
    <div className='flex-col gap-[2rem] px-[2rem] pt-[3rem]'>
      <LibraryRating libraryId={libraryId || ''} />
      <div className='flex-col gap-[2rem]'>
        {reviewData.map((review) => (
          <ReviewCard key={review.reviewId} review={review} isMy={memberData?.id === review.userId} />
        ))}
      </div>
    </div>
  );
}
