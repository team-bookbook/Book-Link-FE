import Icon from '@components/icon';
import type { IGroupCard } from '@pages/home/types/home.types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';

export default function GroupCard({
  id,
  imgurl,
  groupName,
  hostName,
  memberCount,
  description,
  isPrivate,
}: IGroupCard) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(ROUTES.GROUP_DETAIL(String(id)));
  };

  return (
    <div
      onClick={handleClick}
      className='flex h-[14rem] min-w-[33rem] cursor-pointer flex-col gap-[1.5rem] rounded-[10px] bg-white px-[2.3rem] py-[2.45rem] transition-all duration-200 hover:bg-gray-100'
    >
      <div className='flex justify-between'>
        <div className='flex-col gap-[0.6rem]'>
          <div className='flex items-center gap-[0.5rem]'>
            {isPrivate && <Icon name='lock' size={1.6} className='text-gray-600' />}
            <h1 className='title4 text-gray-900'>{groupName}</h1>
          </div>
          <div className='flex-items-center gap-[0.6rem]'>
            {hostName && (
              <>
                <Icon name='profile' className='text-system-info' size={2.4} />
                <h2 className='caption1 text-gray-800'>{hostName}</h2>
                <h2 className='caption1 text-gray-600'>|</h2>
              </>
            )}
            <h3 className='caption5 text-system-error'>{memberCount}명</h3>
          </div>
        </div>
        <div className='flex-row-center h-[5rem] w-[5rem] rounded-[10px] bg-gray-100'>
          {imgurl ? (
            <img
              src={imgurl}
              className='h-full w-full rounded-[10px] object-cover object-center'
              alt='defaultImage'
            ></img>
          ) : (
            <Icon name='logo-alt' className='text-[#b5b5b5]' size={3.8} />
          )}
        </div>
      </div>
      <h4 className='caption5 line-clamp-1 overflow-hidden text-ellipsis text-gray-800'>{description}</h4>{' '}
    </div>
  );
}
