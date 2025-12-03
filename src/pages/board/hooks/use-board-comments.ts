import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentQueries } from '@apis/board/comment-queries';
import { commentMutations } from '@apis/board/comment-mutations';
import type { IReply } from '@apis/board/comment-queries';
import type { ICommentWithReplies } from '@components/bottom-sheet/types/comment';
import { modal } from '@libs/modal';
import { toast } from '@libs/toast';

export function useBoardComments(boardId: string) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadedReplies, setLoadedReplies] = useState<Record<string, IReply[]>>({});
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<{
    kind: 'comment' | 'reply';
    id: string;
    parentId?: string;
  } | null>(null);
  const [selectedManageOption, setSelectedManageOption] = useState<string>('');

  const queryClient = useQueryClient();
  const { data: commentsData = [] } = useQuery(commentQueries.GET_COMMENT_LIST(boardId));
  const createCommentMutation = useMutation(commentMutations.POST_COMMENT());
  const likeCommentMutation = useMutation(commentMutations.POST_COMMENT_LIKE());
  const unlikeCommentMutation = useMutation(commentMutations.DELETE_COMMENT_LIKE());
  const deleteCommentMutation = useMutation(commentMutations.DELETE_COMMENT());

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

  const handleToggleLike = useCallback(
    async (kind: 'comment' | 'reply', id: string, parentId?: string) => {
      try {
        let isLiked = false;

        if (kind === 'comment') {
          const comment = commentsData.find((c) => c.id === id);
          isLiked = comment?.likedByMe ?? false;
        } else if (kind === 'reply' && parentId) {
          const reply = loadedReplies[parentId]?.find((r) => r.id === id);
          isLiked = reply?.likedByMe ?? false;
        }

        if (isLiked) {
          await unlikeCommentMutation.mutateAsync({
            commentId: id,
            boardId,
            parentId,
          });
        } else {
          await likeCommentMutation.mutateAsync({
            commentId: id,
            boardId,
            parentId,
          });
        }

        if (kind === 'reply' && parentId) {
          await handleLoadReplies(parentId);
        }
      } catch (error) {
        console.error('Failed to toggle like:', error);
      }
    },
    [commentsData, loadedReplies, boardId, likeCommentMutation, unlikeCommentMutation]
  );

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

  const handleLongPress = useCallback(
    (kind: 'comment' | 'reply', id: string, parentId?: string) => {
      // 본인의 댓글/대댓글인지 확인
      let isMine = false;
      if (kind === 'comment') {
        const comment = commentsData.find((c) => c.id === id);
        isMine = comment?.isMine ?? false;
      } else if (kind === 'reply' && parentId) {
        const reply = loadedReplies[parentId]?.find((r) => r.id === id);
        isMine = reply?.isMine ?? false;
      }

      // 본인의 것만 관리 옵션 표시
      if (isMine) {
        setSelectedComment({ kind, id, parentId });
        setIsManageOpen(true);
      }
    },
    [commentsData, loadedReplies]
  );

  const closeManageSheet = useCallback(() => {
    setIsManageOpen(false);
    setSelectedComment(null);
    setSelectedManageOption('');
  }, []);

  const handleManageOptionChange = useCallback(
    async (option: string) => {
      setSelectedManageOption(option);

      if (option === 'delete' && selectedComment) {
        const isReply = selectedComment.kind === 'reply';
        const result = await modal.confirm({
          title: `${isReply ? '답글' : '댓글'}을 삭제하시겠습니까?`,
          description: '삭제된 내용은 복구할 수 없습니다.',
          confirmText: '삭제',
          cancelText: '취소',
          confirmVariant: 'danger',
        });

        if (result.ok) {
          try {
            await deleteCommentMutation.mutateAsync({
              commentId: selectedComment.id,
              boardId,
              parentId: selectedComment.parentId,
            });
            toast.success(`${isReply ? '답글' : '댓글'}이 삭제되었습니다`);

            // 대댓글 삭제 시 로컬 상태도 업데이트
            if (isReply && selectedComment.parentId) {
              setLoadedReplies((prev) => {
                const parentReplies = prev[selectedComment.parentId!] || [];
                return {
                  ...prev,
                  [selectedComment.parentId!]: parentReplies.filter((r) => r.id !== selectedComment.id),
                };
              });
            }
          } catch (error) {
            console.error('Failed to delete comment:', error);
            toast.error(`${isReply ? '답글' : '댓글'} 삭제에 실패했습니다`);
          }
        }
      } else if (option === 'modify') {
        console.log('modify:', selectedComment);
      }

      closeManageSheet();
    },
    [selectedComment, closeManageSheet, deleteCommentMutation, boardId]
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
    handleLongPress,
    // 관리 Bottom-sheet
    isManageOpen,
    selectedManageOption,
    closeManageSheet,
    handleManageOptionChange,
  };
}
