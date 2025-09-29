import type { IGroupCard } from '@pages/home/types/home.types';

const ICON_ALT_PROFILE_YELLOW = new URL('@icons/profile-yellow.svg', import.meta.url).href;
const ICON_ALT_LOGO = new URL('@icons/logo-alt.svg', import.meta.url).href;

export default function GroupCard({ id, imgurl, groupName, leaderName, memberCount, description }: IGroupCard) {
  console.log(id);
  return (
    <div className='bg-gray-white flex h-[14rem] min-w-[33rem] cursor-pointer flex-col gap-[1.5rem] rounded-[1rem] px-[2.3rem] py-[2.45rem]'>
      <div className='flex justify-between'>
        <div className='flex-col gap-[0.6rem]'>
          <h1 className='title4 text-gray-900'>{groupName}</h1>
          <div className='flex-items-center gap-[0.6rem]'>
            <img
              src={ICON_ALT_PROFILE_YELLOW}
              alt='default_image'
              className='h-[2.4rem] w-[2.4rem] text-blue-100'
              loading='lazy'
            />
            <h2 className='caption1 text-gray-800'>{leaderName}</h2>
            <h2 className='caption1 text-gray-600'>|</h2>
            <h3 className='caption5 text-system-error'>{memberCount}명</h3>
          </div>
        </div>
        <div className='flex-row-center h-[5rem] w-[5rem] rounded-[1rem] bg-gray-100'>
          {imgurl ? (
            <img></img>
          ) : (
            <img src={ICON_ALT_LOGO} alt='default_image' className='h-[3.8rem] w-[3.8rem]' loading='lazy' />
          )}
        </div>
      </div>
      <h4 className='caption5 line-clamp-2 text-gray-800'>{description}</h4>
    </div>
  );
}
