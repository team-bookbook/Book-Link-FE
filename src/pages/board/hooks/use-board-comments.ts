import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentQueries } from '@apis/board/comment-queries';
import { commentMutations } from '@apis/board/comment-mutations';
import type { IReply } from '@apis/board/comment-queries';
import type { ICommentWithReplies } from '@components/bottom-sheet/types/comment';

export function useBoardComments(boardId: string) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadedReplies, setLoadedReplies] = useState<Record<string, IReply[]>>({});

  const queryClient = useQueryClient();
  const { data: commentsData = [] } = useQuery(commentQueries.GET_COMMENT_LIST(boardId));
  const createCommentMutation = useMutation(commentMutations.POST_COMMENT());

  // 서버 데이터 그대로 사용 (변환 없이)
  const comments: ICommentWithReplies[] = commentsData.map((comment) => ({
    ...comment,
    replies: loadedReplies[comment.id],
  }));

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleToggleLike = useCallback((kind: 'comment' | 'reply', id: string, parentId?: string) => {
    // TODO: 댓글 좋아요 API 연동
    console.log('Toggle comment like:', { kind, id, parentId });
  }, []);

  const handleSendComment = useCallback(
    async (text: string) => {
      try {
        await createCommentMutation.mutateAsync({
          boardId,
          content: text,
        });
        return true;
      } catch (error) {
        console.error('Failed to send comment:', error);
        return false;
      }
    },
    [boardId, createCommentMutation]
  );

  const handleLoadReplies = useCallback(
    async (parentId: string) => {
      try {
        const replies = await queryClient.fetchQuery(commentQueries.GET_REPLY_LIST(parentId));
        setLoadedReplies((prev) => ({
          ...prev,
          [parentId]: replies,
        }));
      } catch (error) {
        console.error('Failed to load replies:', error);
      }
    },
    [queryClient]
  );

  const handleSendReply = useCallback(
    async (parentId: string, text: string) => {
      try {
        await createCommentMutation.mutateAsync({
          boardId,
          parentId,
          content: text,
        });
        // 답글 작성 성공 후 대댓글 목록 다시 로드
        await handleLoadReplies(parentId);
        return true;
      } catch (error) {
        console.error('Failed to send reply:', error);
        return false;
      }
    },
    [boardId, createCommentMutation, handleLoadReplies]
  );

  return {
    comments,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    handleToggleLike,
    handleSendComment,
    handleSendReply,
    handleLoadReplies,
  };
}
