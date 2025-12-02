import { get } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { queryKeys } from '@constants/query-keys';
import { queryOptions } from '@tanstack/react-query';

export type BoardCategory = 'GENERAL' | 'RECOMMEND' | 'GATHER' | 'POPULAR';
export type SortType = 'LATEST' | 'POPULAR';

export interface IBoardPost {
  id: string;
  writerName: string;
  title: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  previewContent: string;
  category: BoardCategory;
  viewCount: number;
}

export interface IBoardDetail extends IBoardPost {
  content: string;
  isUpdated: boolean;
  isOwner: boolean;
}

interface IBoardListParams {
  title?: string;
  category?: string;
  sort?: SortType;
}

export const boardQueries = {
  GET_BOARD_LIST: (params: IBoardListParams = {}) =>
    queryOptions<IBoardPost[]>({
      queryKey: queryKeys.board.list(params),
      queryFn: async () => {
        const res = await get<IBoardPost[]>(END_POINT.BOARD, {
          params,
        });
        return res;
      },
    }),

  GET_BOARD_DETAIL: (id: string) =>
    queryOptions<IBoardDetail>({
      queryKey: queryKeys.board.detail(id),
      queryFn: async () => {
        const res = await get<IBoardDetail>(END_POINT.BOARD_BY_ID(id));
        return res;
      },
    }),
};
