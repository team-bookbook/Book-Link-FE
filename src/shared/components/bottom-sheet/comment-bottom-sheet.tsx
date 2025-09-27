import { useMemo, useState } from 'react';
import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import { cn } from '@libs/cn';
import Icon from '@components/icon';

export type CommentItem = {
  id: number; // ← string → number
  avatarUrl?: string;
  author: string;
  dateText: string;
  content: string;
  likeCount: number;
  replyCount: number;
  liked?: boolean;
  disabled?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;

  comments: readonly CommentItem[];

  onToggleLike?: (id: number) => void; // ← number
  onReplyClick?: (id: number) => void; // ← number
  onSend?: (text: string) => void;

  indicatorStroke?: boolean;
  emptyText?: string;
};

export default function CommentBottomSheet({
  open,
  onClose,
  comments,
  onToggleLike,
  onReplyClick,
  onSend,
  indicatorStroke = true,
  emptyText = '첫 댓글을 남겨보세요.',
}: Props) {
  const [text, setText] = useState('');
  const canSend = useMemo(() => text.trim().length > 0, [text]);

  const handleSend = () => {
    if (!canSend) return;
    onSend?.(text.trim());
    setText('');
  };

  return (
    <BottomSheet isOpen={open} onClose={onClose} indicatorStroke={indicatorStroke}>
      <div className='max-h-[80vh] min-h-[30vh] flex-col'>
        <div className='flex-1 overflow-y-auto'>
          {comments.length === 0 ? (
            <div className='body5 py-[2.4rem] text-center text-gray-500'>{emptyText}</div>
          ) : (
            <ul className='divide-y divide-gray-100'>
              {comments.map((c) => (
                <li key={c.id} className='px-[1.6rem] py-[1.6rem]'>
                  <div className='flex items-start gap-[1.2rem]'>
                    {c.avatarUrl ? (
                      <img src={c.avatarUrl} alt='' className='h-[4rem] w-[4rem] rounded-full object-cover' />
                    ) : (
                      <div className='h-[4rem] w-[4rem] rounded-full bg-gray-100' aria-hidden />
                    )}

                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-[0.8rem]'>
                        <p className='body4 font-semibold text-gray-900'>{c.author}</p>
                        <p className='caption4 text-gray-600'>{c.dateText}</p>
                      </div>

                      <p className='body5 mt-[0.4rem] break-words text-gray-700'>{c.content}</p>

                      <div className='mt-[0.8rem] flex items-center gap-[0.8rem]'>
                        <span className='caption4 inline-flex items-center gap-[0.4rem] text-gray-700'>
                          <Icon name='comment' width={1.6} height={1.6} ariaHidden />
                          {c.replyCount}
                        </span>

                        <button
                          type='button'
                          onClick={() => onReplyClick?.(c.id)}
                          className='caption4 rounded-[2px] bg-gray-100 px-[0.7rem] py-[0.2rem] text-gray-700 active:opacity-80'
                        >
                          답글 달기
                        </button>
                      </div>
                    </div>

                    <div className='flex flex-col items-center gap-[0.4rem] select-none'>
                      <button
                        type='button'
                        aria-pressed={!!c.liked}
                        onClick={() => onToggleLike?.(c.id)}
                        disabled={c.disabled}
                        className={cn('p-[0.2rem] active:opacity-80', c.disabled && 'cursor-not-allowed opacity-50')}
                      >
                        <Icon
                          className='text-system-error'
                          name={c.liked ? 'heart-fill' : 'heart'}
                          size={2}
                          ariaHidden
                        />
                      </button>
                      <span className='caption4 text-gray-800'>{c.likeCount}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='bg-gray-white sticky bottom-0 z-[1]'>
          <div className='px-[1.6rem] py-[1rem]'>
            <div className='flex h-[4.8rem] w-full items-center justify-between rounded-[30px] bg-[#FAFAFA] px-[1.6rem]'>
              <input
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder='댓글을 입력하세요.'
                className='body4 w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-600'
              />
              <button
                type='button'
                aria-label='댓글 전송'
                onClick={handleSend}
                disabled={!canSend}
                className={cn(
                  'flex-row-center bg-secondary-900 h-[3.2rem] w-[3.2rem] rounded-full active:opacity-90',
                  !canSend && 'cursor-not-allowed opacity-60'
                )}
              >
                <Icon name='send' size={2} className='text-gray-white' ariaHidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
