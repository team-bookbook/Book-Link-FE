import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Icon from '@components/icon';
import CommentBottomSheet from '@components/bottom-sheet/comment-bottom-sheet';
import type { CommentItem } from '@components/bottom-sheet/types/comment';
import { boardQueries } from '@apis/board/board-queries';

export default function BoardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);

  console.log(id);

  const { data: boardDetail, isLoading } = useQuery(boardQueries.GET_BOARD_DETAIL(id!));

  const comments: CommentItem[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      author: '홍길동',
      content: '좋은 글이네요!',
      dateText: '1시간 전',
      createdAt: '2025-12-01T05:22:40.043Z',
      isUpdated: true,
      likeCount: 5,
      liked: true,
      isMine: true,
      replyCount: 0,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      author: '김철수',
      content: '저도 같은 생각입니다. 정말 유익한 정보네요.',
      dateText: '2시간 전',
      createdAt: '2025-12-01T06:15:20.043Z',
      isUpdated: false,
      likeCount: 3,
      liked: false,
      isMine: false,
      replyCount: 0,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      author: '이영희',
      content: '공감합니다. 다음에도 이런 내용 기대할게요!',
      dateText: '3시간 전',
      createdAt: '2025-12-01T07:30:15.043Z',
      isUpdated: false,
      likeCount: 8,
      liked: true,
      isMine: false,
      replyCount: 0,
    },
  ];

  const handleCommentSectionClick = () => {
    setIsCommentDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsCommentDrawerOpen(false);
  };

  const handleToggleLike = (kind: 'comment' | 'reply', id: string, parentId?: string) => {
    // TODO: API 연동 - 좋아요 토글
    console.log('Toggle like:', { kind, id, parentId });
  };

  const handleSendComment = async (text: string) => {
    // TODO: API 연동 - 댓글 작성
    console.log('Send comment:', text);
    return true;
  };

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

      <section className='flex-col gap-[1rem]'>
        {/* <h2 className='title4 text-gray-900'>{boardDetail.title}</h2> */}
        <div
          className='body4 min-h-[400px] border-b-1 border-gray-200 py-[1.5rem] text-gray-900'
          style={{ whiteSpace: 'pre-line' }}
        >
          {boardDetail.content}
        </div>
      </section>

      {/* 댓글 섹션 */}
      <section>
        {!isCommentDrawerOpen && (
          <button type='button' onClick={handleCommentSectionClick} className='flex w-full cursor-pointer gap-[1rem]'>
            <span className='flex-items-center gap-[2px]'>
              <Icon name='comment' size={2.4} className='text-primary-900'></Icon>
              <p className='caption1'>{boardDetail.commentCount}</p>
            </span>
            <span className='flex-items-center gap-[2px]'>
              <Icon name='heart' size={2} className='text-system-error'></Icon>
              <p className='caption1'>{boardDetail.likeCount}</p>
            </span>
          </button>
        )}
      </section>

      <CommentBottomSheet
        open={isCommentDrawerOpen}
        onClose={handleCloseDrawer}
        comments={comments}
        onToggleLike={handleToggleLike}
        onSend={handleSendComment}
      />
    </main>
  );
}
