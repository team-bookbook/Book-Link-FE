import Icon from '@components/icon';

interface LibraryLikeProps {
  libraryId: string;
  likeCount?: number;
  isLiked?: boolean;
}

export default function LibraryLike({ libraryId, likeCount = 0, isLiked = false }: LibraryLikeProps) {
  const onFavoriteClick = () => {
    // TODO: 즐겨찾기 API 연동
    console.log('Toggle favorite for library:', libraryId, isLiked);
  };

  return (
    <button onClick={onFavoriteClick} className='flex-items-center cursor-pointer flex-col gap-[0.4rem]' type='button'>
      <Icon name='heart' className='text-system-error' size={2.4} aria-label='즐겨찾기 버튼' />
      <h2 className='caption2 text-gray-white'>{likeCount}</h2>
    </button>
  );
}
