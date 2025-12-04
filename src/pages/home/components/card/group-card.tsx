import Icon from '@components/icon';
import type { IGroupCard } from '@pages/home/types/home.types';

export default function GroupCard({ id, imgurl, groupName, leaderName, memberCount, description }: IGroupCard) {
  console.log(id);
  return (
    <div className='flex h-[14rem] min-w-[33rem] cursor-pointer flex-col gap-[1.5rem] rounded-[10px] bg-white px-[2.3rem] py-[2.45rem]'>
      <div className='flex justify-between'>
        <div className='flex-col gap-[0.6rem]'>
          <h1 className='title4 text-gray-900'>{groupName}</h1>
          <div className='flex-items-center gap-[0.6rem]'>
            {leaderName && (
              <>
                <Icon name='profile' className='text-system-info' size={2.4} />
                <h2 className='caption1 text-gray-800'>{leaderName}</h2>
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
