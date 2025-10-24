import BookCard from '@pages/home/components/card/book-card';
import SectionLayout from '@components/section-layout';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';
import LibraryRatingSection from '@pages/library/components/section/section-library-rating';
import { libraryQueries } from '@apis/library/library-queries';
import { useQuery } from '@tanstack/react-query';

export default function LibraryDetailPage() {
  const { id: libraryId } = useParams<{ id: string }>();
  const { data: libraryInfo } = useQuery(libraryQueries.GET_LIBRARY_DETAIL(libraryId || ''));

  const bookData = libraryInfo?.topBooks || [];

  const [sliderRef] = useKeenSlider({
    mode: 'free-snap',
    slides: {
      perView: 'auto',
      spacing: 10,
    },
  });

  const location = useLocation();
  const navigate = useNavigate();
  const isMyPage = location.pathname === '/library/my';

  const handleFavoriteClick = () => {
    console.log('즐겨찾기 버튼 클릭');
  };

  const handleEditClick = () => {
    navigate(ROUTES.LIBRARY_CREATE);
  };

  const handleDeleteClick = () => {
    if (window.confirm('도서관을 삭제하시겠습니까?')) {
      console.log('도서관 삭제');
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
        {/* 내 페이지인 경우 */}
        {isMyPage && (
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
        <LibraryRatingSection
          rating={libraryInfo.stars}
          reviewCount={0}
          favoriteCount={libraryInfo.likeCount}
          onFavoriteClick={handleFavoriteClick}
        />
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
