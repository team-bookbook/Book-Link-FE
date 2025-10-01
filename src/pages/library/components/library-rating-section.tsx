import Icon from '@components/icon';

interface LibraryRatingSectionProps {
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  onFavoriteClick: () => void;
}

export default function LibraryRatingSection({
  rating,
  reviewCount,
  favoriteCount,
  onFavoriteClick,
}: LibraryRatingSectionProps) {
  const starCount = Math.floor(rating);
  const stars = '★'.repeat(starCount);

  return (
    <div className='flex-row-between'>
      <div className='flex-items-center gap-[1rem]'>
        <h1 className='title1'>{rating}</h1>
        <h2 className='caption1'>{reviewCount}개</h2>
        <span className='text-system-error ml-[0.5rem] text-[1.6rem]'>{stars}</span>
      </div>
      <button
        onClick={onFavoriteClick}
        className='flex-items-center cursor-pointer flex-col gap-[0.4rem]'
        type='button'
      >
        <Icon name='heart' className='text-system-error' size={2.4} aria-label='즐겨찾기 버튼' />
        <h2 className='caption2 text-gray-white'>{favoriteCount}</h2>
      </button>
    </div>
  );
}
