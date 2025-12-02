import { useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { boardQueries } from '@apis/board/board-queries';
import { boardMutations } from '@apis/board/board-mutations';
import { toast } from '@libs/toast';

export function useBoardLike(boardId: string) {
  const { data: isLiked = false } = useQuery(boardQueries.GET_BOARD_LIKE(boardId));
  const { mutate: addLike } = useMutation(boardMutations.POST_BOARD_LIKE(boardId));
  const { mutate: removeLike } = useMutation(boardMutations.DELETE_BOARD_LIKE(boardId));

  const toggleLike = useCallback(() => {
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

  return { isLiked, toggleLike };
}
