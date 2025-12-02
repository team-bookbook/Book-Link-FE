import { post, put, del } from '@apis/base/client';
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

export interface IUpdateBoardParams {
  boardId: string;
  title: string;
  content: string;
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

  PUT_BOARD: () =>
    mutationOptions<string, Error, IUpdateBoardParams>({
      mutationKey: mutationKeys.board.update,
      mutationFn: (data) =>
        put<string>(END_POINT.BOARD, data, {
          headers: {
            'Trace-Id': uuidv4(),
          },
        }),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.board.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.board.detail(variables.boardId) });
      },
    }),

  DELETE_BOARD: (id: string) =>
    mutationOptions<boolean, Error, void>({
      mutationKey: mutationKeys.board.delete,
      mutationFn: () =>
        del<boolean>(END_POINT.BOARD_BY_ID(id), {
          headers: {
            'Trace-Id': uuidv4(),
          },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.board.lists() });
        queryClient.removeQueries({ queryKey: queryKeys.board.detail(id) });
      },
    }),
};
