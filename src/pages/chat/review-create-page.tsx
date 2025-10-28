import Input from '@components/input/input';
import { TopLabel } from './components/chat-top-label';
import { useState } from 'react';
import ButtonFrame from '@components/button/button-frame';
import Button from '@components/button/button';
import Icon from '@components/icon';
import { useParams, useSearchParams } from 'react-router-dom';
import { libraryMutations } from '@apis/library/library-mutations';
import { memberQueries } from '@apis/member/member-queries';
import { useQuery, useMutation } from '@tanstack/react-query';
import { isAuthenticated } from '@/shared/utils/auth';

export default function ReviewCreatePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const reviewType = searchParams.get('type') as 'library' | 'user';
  const { data: memberData } = useQuery({
    ...memberQueries.GET_ME(),
    enabled: isAuthenticated(),
  });

  const createReviewMutation = useMutation(libraryMutations.POST_LIBRARY_REVIEW());

  const [rating, setRating] = useState<number>(0);
  const [desc, setDesc] = useState('');

  const submit = () => {
    if (!canSubmit || !memberData?.id || !id) return;

    createReviewMutation.mutate(
      {
        reviewerId: memberData.id,
        targetId: id,
        targetType: reviewType === 'library' ? 'LIBRARY' : 'USER',
        rating,
        comment: desc,
      },
      {
        onSuccess: () => {
          console.log('요청 완료');
        },
      }
    );
  };

  const canSubmit = desc.trim().length >= 10 && rating > 0;

  return (
    <div className='flex-col gap-[3rem]'>
      <TopLabel isPE={false} />
      <div className='px-[2rem]'>
        <h1 className='body5 text-gray-900'>
          {memberData?.nickName || '사용자'} 님,
          <br />
          {reviewType === 'library' ? '도서관 이용 경험은 어떠셨나요?' : '님과의 거래 경험은 어떠셨나요?'}
        </h1>
        <div className='mt-[1rem] flex'>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type='button'
              onClick={() => setRating(star)}
              className='cursor-pointer transition-colors'
            >
              <Icon name='star' className={`${star <= rating ? 'text-system-error' : 'text-gray-300'}`} size={3} />
            </button>
          ))}
        </div>
        <h2 className='body5 mt-[3rem] text-gray-900'>
          {reviewType === 'library' ? '이용 경험을 공유해 주세요!' : '거래 경험을 공유해주세요!'}
        </h2>
        <Input
          id='book-desc'
          placeholder='경험을 작성해 주세요.'
          multiline
          maxLength={1000}
          hasLength
          value={desc}
          onChange={(e) => setDesc(e.currentTarget.value)}
          length={desc.length}
        />
      </div>
      <ButtonFrame>
        <Button fullWidth roundStyle='rounded-[12px]' className='py-[1.2rem]' disabled={!canSubmit} onClick={submit}>
          등록
        </Button>
      </ButtonFrame>
    </div>
  );
}
