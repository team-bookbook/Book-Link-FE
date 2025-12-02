import { post } from '@apis/base/client';
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
      },
    }),
};
