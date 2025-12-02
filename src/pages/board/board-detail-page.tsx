import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Icon from '@components/icon';
import CommentBottomSheet from '@components/bottom-sheet/comment-bottom-sheet';
import type { CommentItem } from '@components/bottom-sheet/types/comment';
import { boardQueries } from '@apis/board/board-queries';
import { boardMutations } from '@apis/board/board-mutations';
import { useHeaderOverride } from '@contexts/header-context';
import type { ActionId } from '@layouts/header';
import { modal } from '@libs/modal';
import { toast } from '@libs/toast';
import SelectBottomSheet from '@components/bottom-sheet/select-bottom-sheet';
import { REVIEW_MANAGE_OPTIONS, type ReviewManage } from '@components/dropdown/constants/select-options';

export default function BoardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [isManageBottomSheetOpen, setIsManageBottomSheetOpen] = useState(false);
  const [selectedManageOption, setSelectedManageOption] = useState<ReviewManage | null>(null);

  const { data: boardDetail, isLoading } = useQuery(boardQueries.GET_BOARD_DETAIL(id!));
  const { data: isLiked = false } = useQuery(boardQueries.GET_BOARD_LIKE(id!));
  const { mutate: deleteBoard } = useMutation(boardMutations.DELETE_BOARD(id!));
  const { mutate: addLike } = useMutation(boardMutations.POST_BOARD_LIKE(id!));
  const { mutate: removeLike } = useMutation(boardMutations.DELETE_BOARD_LIKE(id!));

  const handleKebabClick = useCallback(() => {
    setIsManageBottomSheetOpen(true);
  }, []);

  const handleManageOptionChange = useCallback(
    async (option: string) => {
      setSelectedManageOption(option as 'modify' | 'delete');
      setIsManageBottomSheetOpen(false);

      if (option === 'modify') {
        navigate(`/board-create?id=${id}`);
      } else if (option === 'delete') {
        const confirmDelete = await modal.confirm({
          title: '정말 삭제하시겠습니까?',
          confirmText: '확인',
          cancelText: '취소',
        });

        if (confirmDelete.ok) {
          deleteBoard(undefined, {
            onSuccess: () => {
              toast.success('게시글이 삭제되었습니다');
              navigate('/board');
            },
            onError: () => {
              toast.error('게시글 삭제에 실패했습니다');
            },
          });
        }
      }
    },
    [id, navigate, deleteBoard]
  );

  const headerConfig = useMemo(() => {
    if (!boardDetail) return null;

    return {
      left: 'back' as const,
      safeTop: true,
      title: boardDetail.title,
      actions: boardDetail.isOwner ? ['kebab' as const] : [],
      onAction: (action: ActionId) => {
        if (action === 'kebab') {
          handleKebabClick();
        }
      },
    };
  }, [boardDetail, handleKebabClick]);

  useHeaderOverride(headerConfig);

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

  const handleBoardLikeClick = useCallback(() => {
    if (isLiked) {
      removeLike(undefined, {
        onSuccess: () => {
          toast.success('게시글 좋아요를 취소했습니다');
        },
        onError: () => {
          toast.error('좋아요 취소에 실패했습니다');
        },
      });
    } else {
      addLike(undefined, {
        onSuccess: () => {
          toast.success('게시글에 좋아요를 눌렀습니다!');
        },
        onError: () => {
          toast.error('좋아요에 실패했습니다');
        },
      });
    }
  }, [isLiked, addLike, removeLike]);

  const handleCommentToggleLike = (kind: 'comment' | 'reply', id: string, parentId?: string) => {
    // TODO: 댓글 좋아요 API 연동
    console.log('Toggle comment like:', { kind, id, parentId });
  };

  const handleSendComment = async (text: string) => {
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

      <section className='flex-col gap-[1rem] pt-5'>
        <h2 className='title4 text-gray-900'>{boardDetail.title}</h2>
        <div
          className='body4 min-h-[400px] border-b-1 border-gray-200 text-gray-700'
          style={{ whiteSpace: 'pre-line' }}
        >
          {boardDetail.content}
        </div>
      </section>

      {/* 댓글 섹션 */}
      <section>
        {!isCommentDrawerOpen && (
          <div className='flex w-full gap-[1rem]'>
            <button type='button' onClick={handleCommentSectionClick} className='cursor-pointer'>
              <span className='flex-items-center gap-[2px]'>
                <Icon name='comment' size={2.4} className='text-primary-900'></Icon>
                <p className='caption1'>{boardDetail.commentCount}</p>
              </span>
            </button>
            <button type='button' onClick={handleBoardLikeClick} className='cursor-pointer'>
              <span className='flex-items-center gap-[2px]'>
                <Icon name={isLiked ? 'heart-fill' : 'heart'} size={2.4} className='text-system-error'></Icon>
                <p className='caption1'>{boardDetail.likeCount}</p>
              </span>
            </button>
          </div>
        )}
      </section>

      <CommentBottomSheet
        open={isCommentDrawerOpen}
        onClose={handleCloseDrawer}
        comments={comments}
        onToggleLike={handleCommentToggleLike}
        onSend={handleSendComment}
      />

      <SelectBottomSheet
        open={isManageBottomSheetOpen}
        onClose={() => setIsManageBottomSheetOpen(false)}
        options={REVIEW_MANAGE_OPTIONS}
        value={selectedManageOption}
        onChange={handleManageOptionChange}
      />
    </main>
  );
}
