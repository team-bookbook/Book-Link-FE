import { useState, useRef, useEffect } from 'react';
import type { IReview } from '@pages/library/types/review.types';

interface ReviewCardProps {
  review: IReview;
  isMy?: boolean;
}

export default function ReviewCard({ review, isMy }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight);
      const contentHeight = contentRef.current.scrollHeight;
      const lines = contentHeight / lineHeight;
      setNeedsExpansion(lines > 3);
    }
  }, [review.comment]);

  return (
    <div className='flex-col gap-[1.5rem]'>
      <div className='flex-row-between'>
        <div className='flex gap-[1rem]'>
          {/* 프로필 이미지 섹션 */}
          <div className='flex-items-center gap-[0.5rem]'>
            <div className='flex-row-center h-[2rem] w-[2rem] overflow-hidden rounded-full bg-gray-200'>
              {/* {review.profileImgUrl ? (
                <img src={review.profileImgUrl} alt={review.nickname} className='h-full w-full object-cover' />
              ) : (
                <Icon name='logo-alt' size={1} className='text-gray-400' />
              )} */}
            </div>
            <h2 className='caption3 text-gray-600'>닉네임</h2>
            {isMy && <h3>내가 작성한것</h3>}
          </div>
          <div className='flex-items-center gap-[0.3rem]'>
            <span className='text-system-error text-[1.1rem]'>★</span>
            <span className='caption5 text-gray-700'>{review.rating}점</span>
            <span className='caption5 text-gray-300'>|</span>
            <span className='caption5 text-gray-700'>2023.05.01</span>
          </div>
        </div>
      </div>
      <div className='flex-col gap-[0.5rem]'>
        <div ref={contentRef} className={`body5 ${isExpanded ? '' : 'line-clamp-3'}`}>
          {review.comment}
        </div>
        {needsExpansion && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='caption5 cursor-pointer self-start text-gray-500'
          >
            {isExpanded ? '접기' : '더보기'}
          </button>
        )}
      </div>
    </div>
  );
}
