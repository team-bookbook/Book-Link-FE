import { post } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { mutationKeys, queryKeys } from '@constants/query-keys';
import queryClient from '@libs/query-client';
import { mutationOptions } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import type { BoardCategory } from './board-queries';

export interface ICreateBoardParams {
  title: string;
  content: string;
  category: BoardCategory;
}

export const boardMutations = {
  POST_BOARD: () =>
    mutationOptions<string, Error, ICreateBoardParams>({
      mutationKey: mutationKeys.board.create,
      mutationFn: (data) =>
        post<string>(END_POINT.BOARD, data, {
          headers: {
            'Trace-Id': uuidv4(),
          },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.board.lists() });
      },
    }),
};
