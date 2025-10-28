import { libraryQueries } from '@apis/library/library-queries';
import { libraryMutations } from '@apis/library/library-mutations';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ReviewCard from './components/card/libary-reivew-card';
import LibraryRating from './components/section/section-library-rating';
import { memberQueries } from '@apis/member/member-queries';
import { isAuthenticated } from '@/shared/utils/auth';
import useBottomSheet from '@components/bottom-sheet/hooks/use-bottom-sheet';
import SelectBottomSheet from '@components/bottom-sheet/select-bottom-sheet';
import { REVIEW_MANAGE_OPTIONS, type ReviewManage } from '@components/dropdown/constants/select-options';
import { useState } from 'react';

export default function LibraryReviewPage() {
  const { id: libraryId } = useParams<{ id: string }>();
  const { isOpen, open, close } = useBottomSheet();
  const [selectedOption, setSelectedOption] = useState<ReviewManage | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string>('');

  const { data: reviewData } = useQuery(libraryQueries.GET_LIBRARY_REVIEW(libraryId || ''));
  const { data: libraryInfo } = useQuery(libraryQueries.GET_LIBRARY_DETAIL(libraryId || ''));
  const { data: memberData } = useQuery({
    ...memberQueries.GET_ME(),
    enabled: isAuthenticated(),
  });

  const deleteReviewMutation = useMutation(libraryMutations.DELETE_LIBRARY_REVIEW());

  const handleReviewManage = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    open();
  };

  const handleOptionChange = (value: string) => {
    setSelectedOption(value as ReviewManage);
    if (value === 'delete') {
      deleteReviewMutation.mutate(selectedReviewId, {
        onSuccess: () => {
          close();
        },
      });
    }
    // 'modify' 처리는 추후 구현
  };

  if (!reviewData || reviewData.length === 0) {
    return <div className='flex items-center justify-center p-[3rem]'>아직 작성된 리뷰가 없습니다.</div>;
  }

  return (
    <div className='flex-col gap-[2rem] px-[2rem] pt-[3rem]'>
      <LibraryRating libraryId={libraryId || ''} likeCount={libraryInfo?.likeCount} />
      <div className='flex-col gap-[2rem]'>
        {reviewData.map((review) => (
          <ReviewCard
            key={review.reviewId}
            review={review}
            isMy={memberData?.id === review.userId}
            handleReviewManage={() => handleReviewManage(review.reviewId)}
          />
        ))}
      </div>
      <SelectBottomSheet
        open={isOpen}
        onClose={close}
        options={REVIEW_MANAGE_OPTIONS}
        value={selectedOption}
        onChange={handleOptionChange}
      />
    </div>
  );
}
