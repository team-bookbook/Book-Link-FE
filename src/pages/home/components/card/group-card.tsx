import Icon from '@components/icon';
import type { IGroupCard } from '@pages/home/types/home.types';

const ICON_ALT_LOGO = new URL('@icons/logo-alt.svg', import.meta.url).href;

export default function GroupCard({ id, imgurl, groupName, leaderName, memberCount, description }: IGroupCard) {
  console.log(id);
  return (
    <div className='flex h-[14rem] min-w-[33rem] cursor-pointer flex-col gap-[1.5rem] rounded-[1rem] bg-white px-[2.3rem] py-[2.45rem]'>
      <div className='flex justify-between'>
        <div className='flex-col gap-[0.6rem]'>
          <h1 className='title4 text-gray-900'>{groupName}</h1>
          <div className='flex-items-center gap-[0.6rem]'>
            <Icon name='profile' className='text-system-info' size={2.4} />
            <h2 className='caption1 text-gray-800'>{leaderName}</h2>
            <h2 className='caption1 text-gray-600'>|</h2>
            <h3 className='caption5 text-system-error'>{memberCount}명</h3>
          </div>
        </div>
        <div className='flex-row-center h-[5rem] w-[5rem] rounded-[1rem] bg-gray-100'>
          {imgurl ? (
            <img
              src={imgurl}
              className='h-full w-full rounded-[1rem] object-cover object-center'
              alt='defaultImage'
            ></img>
          ) : (
            <img src={ICON_ALT_LOGO} alt='default_image' className='h-[3.8rem] w-[3.8rem]' loading='lazy' />
          )}
        </div>
      </div>
      <h4 className='caption5 line-clamp-2 break-words text-gray-800'>{description}</h4>
    </div>
  );
}
