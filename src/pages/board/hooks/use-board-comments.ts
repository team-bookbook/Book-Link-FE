import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentQueries } from '@apis/board/comment-queries';
import { commentMutations } from '@apis/board/comment-mutations';
import type { CommentItem, ReplyItem } from '@components/bottom-sheet/types/comment';
import type { IComment, IReply } from '@apis/board/comment-queries';
import { formatDate } from '@/shared/utils/formatDate';

function mapReplyToItem(reply: IReply): ReplyItem {
  return {
    id: reply.id,
    author: reply.writerName,
    content: reply.content,
    dateText: formatDate(reply.createdAt),
    createdAt: reply.createdAt,
    isUpdated: reply.isUpdated,
    likeCount: reply.likeCount,
    liked: reply.likedByMe,
    isMine: reply.isMine,
  };
}

function mapCommentToItem(comment: IComment, loadedReplies: Record<string, IReply[]>): CommentItem {
  const replies = loadedReplies[comment.id]?.map(mapReplyToItem);

  return {
    id: comment.id,
    author: comment.writerName,
    content: comment.content,
    dateText: formatDate(comment.createdAt),
    createdAt: comment.createdAt,
    isUpdated: comment.isUpdated,
    likeCount: comment.likeCount,
    liked: comment.likedByMe,
    isMine: comment.isMine,
    replyCount: 0, // API에서 제공하지 않음
    topChild: typeof comment.topChild === 'string' ? JSON.parse(comment.topChild) : comment.topChild,
    replies,
  };
}

export function useBoardComments(boardId: string) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadedReplies, setLoadedReplies] = useState<Record<string, IReply[]>>({});

  const queryClient = useQueryClient();
  const { data: commentsData = [] } = useQuery(commentQueries.GET_COMMENT_LIST(boardId));
  const createCommentMutation = useMutation(commentMutations.POST_COMMENT());

  // API 응답을 CommentItem으로 변환
  const comments: CommentItem[] = commentsData.map((comment) => mapCommentToItem(comment, loadedReplies));

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
