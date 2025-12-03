import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Icon from '@components/icon';
import CommentBottomSheet from '@components/bottom-sheet/comment-bottom-sheet';
import { boardQueries } from '@apis/board/board-queries';
import { useHeaderOverride } from '@contexts/header-context';
import type { ActionId } from '@layouts/header';
import SelectBottomSheet from '@components/bottom-sheet/select-bottom-sheet';
import { COMMENT_MANAGE_OPTIONS, REVIEW_MANAGE_OPTIONS } from '@components/dropdown/constants/select-options';
import { useBoardLike } from './hooks/use-board-like';
import { useBoardManagement } from './hooks/use-board-management';
import { useBoardComments } from './hooks/use-board-comments';

export default function BoardDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: boardDetail, isLoading } = useQuery(boardQueries.GET_BOARD_DETAIL(id!));
  const { isLiked, toggleLike } = useBoardLike(id!);
  const { isManageBottomSheetOpen, selectedManageOption, openManageSheet, closeManageSheet, handleManageOptionChange } =
    useBoardManagement(id!);
  const {
    comments,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    handleToggleLike,
    handleSendComment,
    handleSendReply,
    handleLoadReplies,
    handleLongPress,
    isManageOpen: isCommentManageOpen,
    selectedManageOption: selectedCommentManageOption,
    closeManageSheet: closeCommentManageSheet,
    handleManageOptionChange: handleCommentManageOptionChange,
  } = useBoardComments(id!);

  const headerConfig = useMemo(() => {
    if (!boardDetail) return null;

    return {
      left: 'back' as const,
      safeTop: true,
      title: boardDetail.title,
      actions: boardDetail.isOwner ? ['kebab' as const] : [],
      onAction: (action: ActionId) => {
        if (action === 'kebab') {
          openManageSheet();
        }
      },
    };
  }, [boardDetail, openManageSheet]);

  useHeaderOverride(headerConfig);

  // 날짜 포맷팅 (ISO -> YYYY.MM.DD)
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  if (isLoading) {
    return (
      <main className='flex-col gap-[1.5rem] px-[1.5rem] py-[2.5rem]'>
        <div className='body5 py-[4rem] text-center text-gray-500'>로딩 중...</div>
      </main>
    );
  }

  if (!boardDetail) {
    return (
      <main className='flex-col gap-[1.5rem] px-[1.5rem] py-[2.5rem]'>
        <div className='body5 py-[4rem] text-center text-gray-500'>게시글을 찾을 수 없습니다.</div>
      </main>
    );
  }

  return (
    <main className='flex-col gap-[1.5rem] px-[1.5rem] py-[2.5rem]'>
      <header className='flex gap-[1rem]'>
        <div className='h-[4rem] w-[4rem] shrink-0 rounded-full bg-gray-100' />
        <div className='flex-col gap-[0.2rem]'>
          <h1 className='caption1'>{boardDetail.writerName}</h1>
          <p className='caption5 rounded-[2px] bg-gray-100 px-[7px] text-gray-600'>
            {formatDate(boardDetail.createdAt)}
            {boardDetail.isUpdated && ' (수정됨)'}
          </p>
        </div>
      </header>

      <section className='flex-col gap-[1rem] pt-5'>
        <h2 className='title4 text-gray-900'>{boardDetail.title}</h2>
        <div
          className='body4 min-h-[400px] border-b-1 border-gray-200 text-gray-700'
          style={{ whiteSpace: 'pre-line' }}
        >
          {boardDetail.content}
        </div>
      </section>

      <section>
        <div className='flex w-full gap-[1rem]'>
          <button type='button' onClick={openDrawer} className='cursor-pointer'>
            <span className='flex-items-center gap-[2px]'>
              <Icon name='comment' size={2.4} className='text-primary-900'></Icon>
              <p className='caption1'>{boardDetail.commentCount}</p>
            </span>
          </button>
          <button type='button' onClick={toggleLike} className='cursor-pointer'>
            <span className='flex-items-center gap-[2px]'>
              <Icon name={isLiked ? 'heart-fill' : 'heart'} size={2.4} className='text-system-error'></Icon>
              <p className='caption1'>{boardDetail.likeCount}</p>
            </span>
          </button>
        </div>
      </section>

      <CommentBottomSheet
        open={isDrawerOpen}
        onClose={closeDrawer}
        comments={comments}
        onToggleLike={handleToggleLike}
        onLongPress={handleLongPress}
        onSend={handleSendComment}
        onSendReply={handleSendReply}
        onLoadReplies={handleLoadReplies}
      />

      <SelectBottomSheet
        open={isManageBottomSheetOpen}
        onClose={closeManageSheet}
        options={REVIEW_MANAGE_OPTIONS}
        value={selectedManageOption}
        onChange={handleManageOptionChange}
      />

      <SelectBottomSheet
        open={isCommentManageOpen}
        onClose={closeCommentManageSheet}
        options={COMMENT_MANAGE_OPTIONS}
        value={selectedCommentManageOption}
        onChange={handleCommentManageOptionChange}
      />
    </main>
  );
}
