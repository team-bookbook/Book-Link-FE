import type { IBookCard } from '@pages/home/types/home.types';

const ICON_ALT_LOGO = new URL('@icons/logo-alt.svg', import.meta.url).href;

export default function BookCard({ id, index, imgurl, title, author }: IBookCard) {
  console.log(id, index);
  return (
    <div className='keen-slider__slide bg-gray-white flex h-[17rem] min-w-[13rem] cursor-pointer flex-col gap-[0.6rem] rounded-[1rem] border border-gray-200'>
      <div className='flex-row-center relative h-[10rem] overflow-hidden rounded-tl-[1rem] rounded-tr-[1rem] bg-gray-100'>
        {imgurl ? (
          <img src={imgurl} alt={title} className='h-full w-full object-cover object-center' />
        ) : (
          <img src={ICON_ALT_LOGO} alt='default_image' className='absolute h-[3.8rem] w-[3.8rem]' loading='lazy' />
        )}
        <div className='flex-row-center caption5 absolute right-[0.45rem] bottom-[0.45rem] h-[1.7rem] w-[3.5rem] rounded-[0.2rem] bg-gray-50 text-gray-600'>
          D-3
        </div>
      </div>
      <div className='flex-col gap-[0.6rem] px-[1rem]'>
        <h2 className='caption3 text-gray-900'>{title}</h2>
        <h3 className='caption5 text-gray-800'>{author}</h3>
      </div>
    </div>
  );
}
