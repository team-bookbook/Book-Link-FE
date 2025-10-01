import BookCard from '@pages/home/components/card/book-card';
import SectionLayout from '@components/section-layout';
import { useLibraryDetailData } from '@pages/library/hooks/useLibraryDetailData';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import CardReview from './components/card/card-reivew';

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

  console.log(error);

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

    const starCount = Math.floor(libraryInfo.rating);
    const stars = '★'.repeat(starCount);

    return (
      // 이미지 섹션
      <div
        className='flex min-h-[30rem] flex-col justify-end gap-[0.5rem] p-[2rem] text-white'
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
        <div className='flex-col gap-[0.4rem]'>
          <h1 className='title3'>{libraryInfo.name}</h1>
          <h2 className='caption1'>{libraryInfo.hours}</h2>
        </div>
        <div className='flex-row-between'>
          <div className='flex-items-center gap-[1rem]'>
            <h1 className='title1'>{libraryInfo.rating}</h1>
            <h2 className='caption1'>{libraryInfo.reviewCount}개</h2>
            <span className='text-system-error ml-[0.5rem] text-[1.6rem]'>{stars}</span>
          </div>
          <div className='flex-col'></div>
        </div>
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
        onLinkClick={() => {}}
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
        onLinkClick={() => {}}
        isLoading={isLoadingReviews}
        isEmpty={reviewData.length === 0}
      >
        <div className='flex-col gap-[2rem]'>
          {reviewData.map((review) => (
            <CardReview key={review.id} review={review} />
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
