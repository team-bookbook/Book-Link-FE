import BookCard from '@pages/home/components/card/book-card';
import SectionLayout from '@components/section-layout';
import { useLibraryDetailData } from '@pages/library/hooks/useLibraryDetailData';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import ReviewCard from '@pages/library/components/card/libary-reivew-card';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';
import LibraryRatingSection from '@pages/library/components/library-rating-section';

export default function LibraryDetailPage() {
  const { libraryInfo, bookData, reviewData, isLoadingLibraryInfo, isLoadingBooks, isLoadingReviews, error } =
    useLibraryDetailData();
  const [sliderRef] = useKeenSlider({
    mode: 'free-snap',
    slides: {
      perView: 'auto',
      spacing: 10,
    },
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { id: libraryId } = useParams<{ id: string }>();
  const isMyPage = location.pathname === '/library/my';

  console.log(libraryId);

  console.log(error);

  const handleFavoriteClick = () => {
    console.log('즐겨찾기 버튼 클릭');
  };

  const handleEditClick = () => {
    navigate(ROUTES.LIBRARY_CREATE);
  };

  const handleDeleteClick = () => {
    if (window.confirm('도서관을 삭제하시겠습니까?')) {
      // 삭제 로직 추가
      console.log('도서관 삭제');
    }
  };

  const header = () => {
    if (isLoadingLibraryInfo || !libraryInfo) {
      return (
        <div className='flex min-h-[30rem] flex-col justify-end gap-[0.5rem] bg-gray-200 p-[2rem] text-white'>
          <div className='flex-col gap-[0.4rem]'>
            <div className='h-[2.4rem] w-[20rem] animate-pulse rounded bg-gray-300'></div>
            <div className='h-[1.6rem] w-[30rem] animate-pulse rounded bg-gray-300'></div>
          </div>
        </div>
      );
    }

    return (
      <div
        className='relative flex min-h-[30rem] flex-col justify-end gap-[0.5rem] p-[2rem] text-white'
        style={
          libraryInfo.imageUrl
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(${libraryInfo.imageUrl})`,
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
              className='flex-row-center caption5 cursor-pointer rounded-[0.2rem] bg-gray-100 px-[0.7rem] text-gray-600'
            >
              수정하기
            </button>
            <button
              onClick={handleDeleteClick}
              className='flex-row-center caption5 text-system-error cursor-pointer rounded-[0.2rem] bg-gray-100 px-[0.7rem]'
            >
              삭제하기
            </button>
          </div>
        )}
        <div className='flex-col gap-[0.4rem]'>
          <h1 className='title3'>{libraryInfo.name}</h1>
          <h2 className='caption1'>{libraryInfo.hours}</h2>
        </div>
        <LibraryRatingSection
          rating={libraryInfo.rating}
          reviewCount={libraryInfo.reviewCount}
          favoriteCount={libraryInfo.favoriteCount}
          onFavoriteClick={handleFavoriteClick}
        />
      </div>
    );
  };

  const titleDescription = () => {
    if (isLoadingLibraryInfo || !libraryInfo) return null;

    return (
      <div className='flex-col gap-[1rem] px-[2rem]'>
        <h1 className='caption2'>{libraryInfo.description.title}</h1>
        <h2 className='caption5'>{libraryInfo.description.content}</h2>
      </div>
    );
  };

  const rewardDescription = () => {
    if (isLoadingLibraryInfo || !libraryInfo) return null;

    return (
      <div className='flex-col gap-[1rem] px-[2rem]'>
        <h1 className='caption2'>{libraryInfo.reward.title}</h1>
        <span className='flex-items-center gap-[0.8rem]'>
          <h2 className='catpion4 text-gray-700'>{libraryInfo.reward.pointLabel}</h2>
          <h2 className='caption5'>{libraryInfo.reward.pointDescription}</h2>
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
        isLoading={isLoadingBooks}
        isEmpty={bookData.length === 0}
      >
        <div>
          <div ref={sliderRef} className='keen-slider px-[2rem]'>
            {bookData.map((book, index) => (
              <BookCard
                key={`${book.id}-${index}`}
                id={book.id}
                index={index}
                imgurl={book.imgurl}
                title={book.title}
                author={book.author}
                expDate={book.expDate}
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
        isLoading={isLoadingReviews}
        isEmpty={reviewData.length === 0}
      >
        <div className='flex-col gap-[2rem]'>
          {reviewData.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
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
