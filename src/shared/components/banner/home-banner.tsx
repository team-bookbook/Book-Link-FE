import { cn } from '@libs/cn';

type Props = {
  hasLoan: boolean; // 대여한 책이 있는지
  title?: string; // hasLoan=true 일 때 책 제목
  dday?: number; // hasLoan=true 일 때 D 값 (0=D-day, 1=D-1 ...)
  className?: string;
  bgClassName?: string;
};

const ICON_BOOKS = new URL('@images/emoji-books.png', import.meta.url).href;
const ICON_CARD = new URL('@images/emoji-card.png', import.meta.url).href;
const ICON_SEARCH = new URL('@images/emoji-search.png', import.meta.url).href;
const ICON_LIBRARY = new URL('@images/emoji-library.png', import.meta.url).href;

export default function HomeBanner({ hasLoan, title, dday, className = '', bgClassName = 'bg-linear-home' }: Props) {
  const dueText = dday === 0 ? 'D-day' : `D-${dday ?? 0}`;

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden rounded-[12px]',
        'px-[2.4rem] py-[4.2rem]',
        'bg-cover bg-no-repeat',
        bgClassName,
        className
      )}
      aria-label='홈 배너'
    >
      {hasLoan ? (
        <div className='flex-col gap-[0.8rem]'>
          <p>
            <span className='title4 text-primary-900 mr-[0.6rem]'>{title}</span>
            <span className='body5 text-gray-700'>도서 반납까지</span>
          </p>

          <div className='flex items-baseline gap-[0.8rem]'>
            <span className='title1 text-gray-900'>{dueText}</span>
            <span className='body5 text-gray-700'>남았어요!</span>
          </div>
        </div>
      ) : (
        <div className='flex-col gap-[0.2rem]'>
          <p className='body5 text-gray-700'>아직 대여한 도서가 없어요!</p>
          <p className='body5 whitespace-pre-line text-gray-900'>
            {'도서를 대여하거나,\n나만의 도서관을 운영해 보세요!'}
          </p>
        </div>
      )}

      <div aria-hidden className='pointer-events-none select-none'>
        <img
          src={ICON_BOOKS}
          alt=''
          className='absolute top-[1.2rem] left-[1.2rem] h-[2.5rem] w-[2.5rem] -rotate-[22deg]'
          loading='lazy'
        />
        <img
          src={ICON_CARD}
          alt=''
          className='absolute top-[1.2rem] right-[1.2rem] h-[2.5rem] w-[2.5rem]'
          loading='lazy'
        />
        <img
          src={ICON_SEARCH}
          alt=''
          className='absolute top-[6.4rem] right-[5rem] h-[2.8rem] w-[2.8rem]'
          loading='lazy'
        />
        <img
          src={ICON_LIBRARY}
          alt=''
          className='absolute right-[1.2rem] bottom-[1.6rem] h-[2.8rem] w-[2.8rem] rotate-[15deg]'
          loading='lazy'
        />
      </div>
    </section>
  );
}
