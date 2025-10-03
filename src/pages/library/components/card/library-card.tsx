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
        <div className='bl-[1rem] flex-row-center h-[4rem] w-[4rem] shrink-0 overflow-hidden rounded-full bg-white'>
          {library.profileImgUrl ? (
            <img src={library.profileImgUrl} alt={library.owner} className='h-full w-full object-cover' />
          ) : (
            <Icon name='logo-alt' size={2} className='text-gray-400' />
          )}
        </div>
        <div className='flex-col'>
          <h1 className='caption3'>{library.owner}</h1>
          <h2 className='caption5 text-gray-600'>즐겨찾는 인원 {library.followerCount}명</h2>
        </div>
        <button className='bg-gray-white caption3 ml-auto cursor-pointer rounded-[8px] border border-gray-300 px-[2.8rem] py-[0.8rem]'>
          즐겨찾기
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
      <div className='flex-row-center h-[31.7rem] w-full overflow-hidden bg-gray-50'>
        {library.coverImgUrl ? (
          <img src={library.coverImgUrl} alt={library.name} className='h-full w-full object-cover' />
        ) : (
          <Icon name='logo-alt' size={6} className='text-gray-400' />
        )}
      </div>
      <div className='flex-col gap-[1rem] rounded-br-[10px] rounded-bl-[10px] px-[1rem]'>
        <h1 className='caption2'>{library.name}</h1>
        <h2 className='caption5'>{library.description}</h2>
      </div>
      <div />
    </div>
  );
}
