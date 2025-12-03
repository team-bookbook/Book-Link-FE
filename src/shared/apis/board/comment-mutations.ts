import { post, del } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { mutationKeys, queryKeys } from '@constants/query-keys';
import queryClient from '@libs/query-client';
import { mutationOptions } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export interface ICreateCommentParams {
  boardId: string;
  parentId?: string;
  content: string;
}

export interface IToggleCommentLikeParams {
  commentId: string;
  boardId: string;
  parentId?: string;
}

export const commentMutations = {
  POST_COMMENT: () =>
    mutationOptions<string, Error, ICreateCommentParams>({
      mutationKey: mutationKeys.comment.create,
      mutationFn: (data) =>
        post<string>(END_POINT.COMMENT, data, {
          headers: {
            'Trace-Id': uuidv4(),
          },
        }),
      onSuccess: (_, variables) => {
        console.log(variables);
        queryClient.invalidateQueries({ queryKey: queryKeys.comment.list(variables.boardId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.board.detail(variables.boardId) });
        if (variables.parentId)
          queryClient.invalidateQueries({ queryKey: queryKeys.comment.repliesList(variables.parentId) });
      },
    }),

  POST_COMMENT_LIKE: () =>
    mutationOptions<boolean, Error, IToggleCommentLikeParams>({
      mutationKey: mutationKeys.comment.like,
      mutationFn: (data) => post<boolean>(END_POINT.COMMENT_LIKE(data.commentId)),
      onSuccess: (_, variables) => {
        // 댓글 목록과 대댓글 목록 갱신
        queryClient.invalidateQueries({ queryKey: queryKeys.comment.list(variables.boardId) });
        if (variables.parentId) {
          queryClient.invalidateQueries({ queryKey: queryKeys.comment.repliesList(variables.parentId) });
        }
      },
    }),

  DELETE_COMMENT_LIKE: () =>
    mutationOptions<boolean, Error, IToggleCommentLikeParams>({
      mutationKey: mutationKeys.comment.like, // POST와 동일한 키 사용
      mutationFn: (data) => del<boolean>(END_POINT.COMMENT_LIKE(data.commentId)),
      onSuccess: (_, variables) => {
        // 댓글 목록과 대댓글 목록 갱신
        queryClient.invalidateQueries({ queryKey: queryKeys.comment.list(variables.boardId) });
        if (variables.parentId) {
          queryClient.invalidateQueries({ queryKey: queryKeys.comment.repliesList(variables.parentId) });
        }
      },
    }),
};
