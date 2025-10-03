import Icon from '@components/icon';
import { cn } from '@libs/cn';

type PostCardProps = {
  title: string;
  content: string;
  commentCount: number;
  likeCount: number;
  date: string;
  author: string;
  className?: string;
  onClick?: () => void;
};

export default function PostCard({
  title,
  content,
  commentCount,
  likeCount,
  date,
  author,
  className,
  onClick,
}: PostCardProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'bg-gray-white w-full border-t border-gray-200',
        'px-[2rem] py-[1.5rem] text-gray-900',
        'flex-col justify-start gap-[1rem]',
        className
      )}
    >
      <div className='flex w-full'>
        <h3 className='title6'>{title}</h3>
      </div>
      <div className='flex w-full min-w-0'>
        <p className='body5 truncate text-left text-gray-800'>{content}</p>
      </div>

      <div className='flex flex-wrap items-center gap-[0.5rem]'>
        <div className='flex items-center gap-[0.3rem]'>
          <Icon name='comment' size={1.6} ariaHidden />
          <span className='caption5'>{commentCount}</span>
        </div>

        <div className='flex items-center gap-[0.3rem]'>
          <Icon name='heart' size={1.6} ariaHidden />
          <span className='caption5'>{likeCount}</span>
        </div>

        <span className='caption5 rounded-[2px] bg-gray-100 px-[0.7rem] py-[0.2rem] text-gray-600' aria-label='작성일'>
          {date}
        </span>
        <span className='caption5 rounded-[2px] bg-gray-100 px-[0.7rem] py-[0.2rem] text-gray-600' aria-label='작성자'>
          {author}
        </span>
      </div>
    </button>
  );
}
