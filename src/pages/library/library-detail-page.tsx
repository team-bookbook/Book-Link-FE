import { useEffect } from 'react';
import BookCard from '@pages/home/components/card/book-card';
import SectionLayout from '@components/section-layout';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';
import { libraryQueries } from '@apis/library/library-queries';
import { libraryMutations } from '@apis/library/library-mutations';
import { useQuery, useMutation } from '@tanstack/react-query';
import { modal } from '@libs/modal';

export default function LibraryDetailPage() {
  const { id: libraryId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 내 도서관 여부 확인
  const isMyLibrary = libraryId === 'my';

  const { data: libraryInfo, isLoading } = useQuery(libraryQueries.GET_LIBRARY_DETAIL(libraryId || ''));

  console.log(libraryInfo);

  const bookData = libraryInfo?.topBooks || [];

  // my 도서관이 없으면 생성 페이지로 리다이렉트
  useEffect(() => {
    if (isMyLibrary && !isLoading && !libraryInfo) {
      navigate(ROUTES.LIBRARY_CREATE);
    }
  }, [isMyLibrary, isLoading, libraryInfo, navigate]);

  const [sliderRef] = useKeenSlider({
    mode: 'free-snap',
    slides: {
      perView: 'auto',
      spacing: 10,
    },
  });

  const deleteMutation = useMutation(libraryMutations.DELETE_LIBRARY());

  const handleEditClick = () => {
    if (!libraryId) return;
    navigate(`${ROUTES.LIBRARY_CREATE}?id=${libraryId}`);
  };

  const handleDeleteClick = async () => {
    if (!libraryId) return;

    const result = await modal.confirm({
      title: '도서관을 삭제하시겠습니까?',
      description: '삭제된 도서관은 복구할 수 없습니다.',
      confirmText: '삭제',
      cancelText: '취소',
      confirmVariant: 'danger',
    });

    if (result.ok) {
      try {
        await deleteMutation.mutateAsync(libraryId);
        navigate(`${ROUTES.LIBRARY}/?tab=libraries`);
      } catch (error) {
        console.error('도서관 삭제 실패:', error);
      }
    }
  };

  const header = () => {
    if (!libraryInfo) {
      return (
        <div className='flex min-h-[30rem] flex-col justify-end gap-[0.5rem] bg-gray-200 p-[2rem] text-white'>
          <div className='flex-col gap-[0.4rem]'>
            <div className='h-[2.4rem] w-[20rem] animate-pulse rounded bg-gray-300' />
            <div className='h-[1.6rem] w-[30rem] animate-pulse rounded bg-gray-300' />
          </div>
        </div>
      );
    }

    return (
      <div
        className='relative flex min-h-[30rem] flex-col justify-end gap-[0.5rem] p-[2rem] text-white'
        style={
          libraryInfo.thumbnailUrl
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(${libraryInfo.thumbnailUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { backgroundColor: 'rgb(229, 231, 235)' }
        }
      >
        {/* 내 페이지인 경우에만 수정/삭제 버튼 표시 */}
        {isMyLibrary && (
          <div className='absolute top-[3rem] right-[2rem] flex gap-[0.3rem]'>
            <button
              onClick={handleEditClick}
              className='flex-row-center caption5 cursor-pointer rounded-[2px] bg-gray-100 px-[0.7rem] text-gray-600'
            >
              수정하기
            </button>
            <button
              onClick={handleDeleteClick}
              className='flex-row-center caption5 text-system-error cursor-pointer rounded-[2px] bg-gray-100 px-[0.7rem]'
            >
              삭제하기
            </button>
          </div>
        )}
        <div className='flex-col gap-[0.4rem]'>
          <h1 className='title3'>{libraryInfo.name}</h1>
          <h2 className='caption1'>{`${libraryInfo.startTime} - ${libraryInfo.endTime}`}</h2>
        </div>
        {/* <LibraryRating libraryId={libraryId || ''} likeCount={libraryInfo.likeCount} /> */}
      </div>
    );
  };

  const titleDescription = () => {
    if (!libraryInfo?.description) return null;

    return (
      <div className='flex-col gap-[1rem] px-[2rem]'>
        <h1 className='caption2 text-gray-900'>우리 도서관을 소개합니다!</h1>
        <h2 className='caption5'>{libraryInfo.description}</h2>
      </div>
    );
  };

  const rewardDescription = () => {
    return (
      <div className='flex-col gap-[1rem] px-[2rem]'>
        <h1 className='caption2'>혜택 안내</h1>
        <span className='flex-items-center gap-[0.8rem]'>
          <h2 className='catpion4 text-gray-700'>포인트 적립</h2>
          <h2 className='caption5'>1% BookLink 포인트 적립</h2>
        </span>
      </div>
    );
  };

  const bookListSection = () => {
    return (
      <SectionLayout
        title='책장'
        linkText='전체보기 →'
        onLinkClick={() => {
          console.log(libraryId);
          if (libraryId) {
            navigate(ROUTES.LIBRARY_BOOK(libraryId));
          }
        }}
        isEmpty={bookData.length === 0}
      >
        <div>
          <div ref={sliderRef} className='keen-slider px-[2rem]'>
            {bookData.map((book, index) => (
              <BookCard
                key={`${book.bookId}-${index}`}
                id={parseInt(book.bookId, 10)}
                index={index}
                imgurl=''
                title={book.title}
                author={book.author}
                expDate={0}
              />
            ))}
          </div>
        </div>
      </SectionLayout>
    );
  };

  const reviewSection = () => {
    return (
      <SectionLayout
        title='리뷰'
        linkText='전체보기 →'
        onLinkClick={() => {
          if (libraryId) {
            navigate(ROUTES.LIBRARY_REVIEW(libraryId));
          }
        }}
        // isEmpty={reviewData.length === 0}
      >
        <div className='flex-col gap-[2rem] px-[2rem]'>
          {/* {reviewData.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))} */}
        </div>
      </SectionLayout>
    );
  };

  return (
    <div className='flex-col gap-[3rem]'>
      {header()}
      {titleDescription()}
      {rewardDescription()}
      {bookListSection()}
      {reviewSection()}
    </div>
  );
}
