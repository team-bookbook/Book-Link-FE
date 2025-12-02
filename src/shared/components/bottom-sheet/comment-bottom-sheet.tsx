import { useMemo, useState } from 'react';
import BottomSheet from '@components/bottom-sheet/bottom-sheet';
import { cn } from '@libs/cn';
import Icon from '@components/icon';
import type { CommentProps } from '@components/bottom-sheet/types/comment';

export default function CommentBottomSheet(props: CommentProps) {
  const {
    open,
    onClose,
    comments,
    onToggleLike,
    onReplyClick,
    onSend,
    onSendReply,
    onLoadReplies,
    indicatorStroke = true,
    emptyText = '첫 댓글을 남겨보세요!',
  } = props;

  const [text, setText] = useState('');
  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);

  const canSend = useMemo(() => text.trim().length > 0, [text]);

  const targetAuthor = useMemo(() => {
    if (replyTargetId == null) return null;
    return comments.find((c) => c.id === replyTargetId)?.author ?? null;
  }, [comments, replyTargetId]);

  const handleSend = async () => {
    if (!canSend) return;
    const payload = text.trim();

    let ok: boolean | void | undefined;
    if (replyTargetId != null) ok = await onSendReply?.(replyTargetId, payload);
    else ok = await onSend?.(payload);

    if (ok === false) return;
    setText('');
    setReplyTargetId(null);
  };

  const toggleReplies = async (parentId: string) => {
    const next = !openReplies[parentId];
    console.log(parentId);
    setOpenReplies((m) => ({ ...m, [parentId]: next }));
    if (next) await onLoadReplies?.(parentId);
  };

  return (
    <BottomSheet
      isOpen={open}
      onClose={onClose}
      indicatorStroke={indicatorStroke}
      draggable
      dragHandleOnly
      dragCloseThresholdPx={120}
    >
      <div className='max-h-[80vh] min-h-[30vh] flex-col pb-[7.7rem]'>
        <div className='flex-1 overflow-y-auto'>
          {comments.length === 0 ? (
            <div className='body5 py-[2.4rem] text-center text-gray-500'>{emptyText}</div>
          ) : (
            <ul className='divide-y divide-gray-100'>
              {comments.map((c) => {
                const isRepliesOpen = !!openReplies[c.id];
                const loadedCount = c.replies?.length ?? 0;
                const hasMoreHint = c.replyCount > loadedCount;

                return (
                  <li key={c.id} className='px-[1.6rem] py-[1.6rem]'>
                    <div className='flex items-start gap-[1.2rem]'>
                      {c.avatarUrl ? (
                        <img src={c.avatarUrl} alt='' className='h-[4rem] w-[4rem] rounded-full object-cover' />
                      ) : (
                        <div className='h-[4rem] w-[4rem] rounded-full bg-gray-100' aria-hidden />
                      )}

                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center gap-[0.8rem]'>
                          <p className='body4 text-gray-900'>{c.author}</p>
                          <p className='caption4 text-gray-600'>{c.dateText}</p>
                        </div>

                        <p className='body5 mt-[0.4rem] break-words text-gray-700'>{c.content}</p>

                        <div className='mt-[0.8rem] flex items-center gap-[0.8rem]'>
                          <span className='caption4 flex items-center gap-[0.4rem] text-gray-700'>
                            <Icon name='comment' width={1.6} height={1.6} ariaHidden />
                            {c.replyCount}
                          </span>

                          <button
                            type='button'
                            onClick={() => {
                              setReplyTargetId(c.id);
                              onReplyClick?.(c.id);
                            }}
                            className='caption4 cursor-pointer rounded-[2px] bg-gray-100 px-[0.7rem] py-[0.2rem] text-gray-700 active:opacity-80'
                          >
                            답글 달기
                          </button>
                        </div>
                      </div>

                      <div className='flex-col-center gap-[0.4rem] select-none'>
                        <button
                          type='button'
                          aria-pressed={!!c.liked}
                          onClick={() => onToggleLike?.('comment', c.id)}
                          disabled={c.disabled}
                          className={cn(
                            'cursor-pointer p-[0.2rem] active:opacity-80',
                            c.disabled && 'cursor-not-allowed opacity-50'
                          )}
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
                    {c.replyCount > 0 && (
                      <button
                        type='button'
                        onClick={() => toggleReplies(c.id)}
                        className='caption4 mt-[0.6rem] cursor-pointer text-gray-700 active:opacity-80'
                      >
                        {isRepliesOpen ? '답글 접기' : `— 답글 ${hasMoreHint ? c.replyCount : loadedCount}개 더 보기`}
                      </button>
                    )}
                    {isRepliesOpen && loadedCount > 0 && (
                      <ul className='mt-[1.2rem] space-y-[0.8rem]'>
                        {c.replies!.map((r) => (
                          <li key={r.id} className='flex items-start gap-[0.8rem] pl-[3.6rem]'>
                            {r.avatarUrl ? (
                              <img
                                src={r.avatarUrl}
                                alt=''
                                className='h-[2.2rem] w-[2.2rem] rounded-full object-cover'
                              />
                            ) : (
                              <div className='h-[2.2rem] w-[2.2rem] rounded-full bg-gray-100' aria-hidden />
                            )}
                            <div className='min-w-0 flex-1'>
                              <div className='flex items-center gap-[0.6rem]'>
                                <p className='caption3 font-semibold text-gray-900'>{r.author}</p>
                                <p className='caption5 text-gray-600'>{r.dateText}</p>
                              </div>
                              <p className='caption3 mt-[0.2rem] break-words text-gray-700'>{r.content}</p>
                            </div>
                            <div className='flex-col-center gap-[0.2rem] select-none'>
                              <button
                                type='button'
                                aria-pressed={!!r.liked}
                                onClick={() => onToggleLike?.('reply', r.id, c.id)}
                                disabled={r.disabled}
                                className={cn('p-[0.2rem] active:opacity-80', r.disabled && 'opacity-50')}
                              >
                                <Icon
                                  className='text-system-error'
                                  name={r.liked ? 'heart-fill' : 'heart'}
                                  size={1.6}
                                  ariaHidden
                                />
                              </button>
                              <span className='caption5 text-gray-800'>{r.likeCount}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className='bg-gray-white fixed bottom-0 z-[1] w-full'>
          <div className='px-[1.6rem] py-[1rem]'>
            {replyTargetId !== null && (
              <div className='flex-row-between mb-[0.8rem] rounded-[18px] bg-gray-50 px-[1.2rem] py-[0.8rem] ring-1 ring-gray-100'>
                <p className='caption3 truncate text-gray-600'>
                  <span className='text-gray-700'>{targetAuthor ?? '사용자'}</span>
                  님에게 답글 남기는 중
                </p>
                <button
                  type='button'
                  aria-label='답글 취소'
                  onClick={() => setReplyTargetId(null)}
                  className='cursor-pointer p-[0.4rem] text-gray-500 active:opacity-80'
                >
                  <Icon name='close' size={1.6} ariaHidden />
                </button>
              </div>
            )}

            <div className='flex-row-between h-[4.8rem] w-full rounded-[30px] bg-gray-50 px-[1.6rem]'>
              <input
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={replyTargetId ? '답글을 입력하세요.' : '댓글을 입력하세요.'}
                className='body4 w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-600'
              />
              <button
                type='button'
                aria-label='전송'
                onClick={handleSend}
                disabled={!canSend}
                className={cn(
                  'flex-row-center h-[3.2rem] w-[3.2rem] cursor-pointer rounded-full active:opacity-90',
                  canSend ? 'bg-secondary-900' : 'bg-secondary-900 cursor-not-allowed opacity-60'
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
