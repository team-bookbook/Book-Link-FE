import Icon from '@components/icon';
import type { IBookCard } from '@pages/home/types/home.types';

interface BookCardProps extends IBookCard {
  size?: 'large' | 'small';
}

export default function BookCard({ id, index, imgurl, title, author, expDate, size = 'small' }: BookCardProps) {
  console.log(id, index);

  const sizeClasses = {
    small: {
      container:
        'keen-slider__slide bg-gray-white flex h-[17rem] min-w-[13rem] cursor-pointer flex-col gap-[0.6rem] rounded-[1rem] border border-gray-200',
      imageContainer:
        'flex-row-center relative h-[10rem] overflow-hidden rounded-tl-[1rem] rounded-tr-[1rem] bg-gray-100',
      titleClass: 'caption3',
      authorClass: 'caption5',
      iconSize: 3.8,
    },
    large: {
      container:
        'bg-gray-white flex min-h-[20.9rem] min-w-[15.3rem] cursor-pointer flex-col gap-[0.8rem] rounded-[1rem] border border-gray-200',
      imageContainer:
        'flex-row-center relative h-[12rem] overflow-hidden rounded-tl-[1rem] rounded-tr-[1rem] bg-gray-100',
      titleClass: 'caption1',
      authorClass: 'caption3',
      iconSize: 4.5,
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={currentSize.container}>
      <div className={currentSize.imageContainer}>
        {imgurl ? (
          <img src={imgurl} alt={title} className='h-full w-full object-cover object-center' />
        ) : (
          <Icon name='logo-alt' size={currentSize.iconSize} className='text-[#b5b5b5]' />
        )}
        <div
          className={`flex-row-center caption5 absolute right-[0.45rem] bottom-[0.45rem] h-[1.7rem] w-[3.5rem] rounded-[0.2rem] bg-gray-50 ${expDate <= 3 ? 'text-system-error' : 'text-gray-600'}`}
        >
          D-{expDate}
        </div>
      </div>
      <div className='flex-col gap-[0.6rem] px-[1rem]'>
        <h2 className={`${currentSize.titleClass} text-gray-900`}>{title}</h2>
        <h3 className={`${currentSize.authorClass} text-gray-800`}>{author}</h3>
      </div>
    </div>
  );
}
