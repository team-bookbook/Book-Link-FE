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
      <div className='flex gap-[1rem] rounded-tl-[1rem] rounded-tr-[1rem] p-[1rem]'>
        {/* 프로필 이미지 */}
        <div className='bl-[1rem] flex-row-center h-[4rem] w-[4rem] shrink-0 overflow-hidden rounded-full bg-white'>
          {library.profileImgUrl ? (
            <img src={library.profileImgUrl} alt={library.owner} className='h-full w-full object-cover' />
          ) : (
            <Icon name='logo-alt' size={2} className='text-gray-400' />
          )}
        </div>
        <div className='flex-col'>
          <h1 className='caption3'>{library.owner}</h1>
          <h2 className='caption5 text-gray-600'>구독자 수 {library.followerCount}명</h2>
        </div>
      </div>
    );
  };
  return (
    <div onClick={handleCardClick} className='min-h-[50.8rem] cursor-pointer flex-col rounded-[1rem] bg-gray-100'>
      {header()}
      <div className='flex-row-center h-[31.7rem] w-full overflow-hidden bg-gray-200'>
        {library.coverImgUrl ? (
          <img src={library.coverImgUrl} alt={library.name} className='h-full w-full object-cover' />
        ) : (
          <Icon name='logo-alt' size={6} className='text-gray-400' />
        )}
      </div>
      <div className='flex-col gap-[1rem] rounded-br-[1rem] rounded-bl-[1rem] px-[1rem] py-[2rem]'>
        <h1 className='caption2'>{library.name}</h1>
        <h2 className='caption5'>{library.description}</h2>
      </div>
    </div>
  );
}
