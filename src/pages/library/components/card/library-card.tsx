import Icon from '@components/icon';
import type { ILibrary } from '@pages/library/types/library.types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';

interface LibraryCardProps {
  library: ILibrary;
}

export default function LibraryCard({ library }: LibraryCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(ROUTES.LIBRARY_DETAIL(library.id.toString()));
  };

  const header = () => {
    return (
      <div className='flex gap-[1rem] rounded-tl-[10px] rounded-tr-[10px] p-[1rem]'>
        <div className='bl-[1rem] flex-row-center h-[4rem] w-[4rem] shrink-0 overflow-hidden rounded-full bg-gray-100'>
          {library.thumbnailUrl ? (
            <img src={library.thumbnailUrl} alt={library.name} className='h-full w-full object-cover' />
          ) : (
            <div className='h-full w-full' />
          )}
        </div>
        <div className='flex-col'>
          <h1 className='caption3'>{library.name}</h1>
          <h2 className='caption5 text-gray-600'>좋아요 {library.likeCount}개</h2>
        </div>
        <button className='ml-auto cursor-pointer'>
          <Icon name='heart' className='text-system-error' size={2.4} />
        </button>
      </div>
    );
  };
  return (
    <div
      onClick={handleCardClick}
      className='min-h-[48.1rem] cursor-pointer flex-col gap-[1.5rem] rounded-[10px] bg-gray-50'
    >
      {header()}
      <div className='flex-row-center h-[31.7rem] w-full overflow-hidden bg-gray-100'>
        {library.thumbnailUrl ? (
          <img src={library.thumbnailUrl} alt={library.name} className='h-full w-full object-cover' />
        ) : (
          <div className='h-full w-full' />
        )}
      </div>
      <div className='flex-col gap-[1rem] rounded-br-[10px] rounded-bl-[10px] px-[1rem]'>
        <div className='flex items-center gap-[0.5rem]'>
          <h1 className='caption2'>{library.name}</h1>
          <span className='caption5 text-gray-600'>★ {library.stars}</span>
        </div>
        <h2 className='caption5'>{library.description}</h2>
        <div className='caption5 text-gray-600'>도서 {library.bookCount}권</div>
      </div>
      <div />
    </div>
  );
}
