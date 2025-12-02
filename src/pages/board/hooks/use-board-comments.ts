import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { commentQueries } from '@apis/board/comment-queries';
import type { CommentItem } from '@components/bottom-sheet/types/comment';
import type { IComment } from '@apis/board/comment-queries';
import { formatDate } from '@/shared/utils/formatDate';

function mapCommentToItem(comment: IComment): CommentItem {
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
  };
}

export function useBoardComments(boardId: string) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: commentsData = [] } = useQuery(commentQueries.GET_COMMENT_LIST(boardId));

  // API 응답을 CommentItem으로 변환
  const comments: CommentItem[] = commentsData.map(mapCommentToItem);

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

  const handleSendComment = useCallback(async (text: string) => {
    // TODO: 댓글 작성 API 연동
    console.log('Send comment:', text);
    return true;
  }, []);

  return {
    comments,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    handleToggleLike,
    handleSendComment,
  };
}
