import { get } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { queryKeys } from '@constants/query-keys';
import { queryOptions } from '@tanstack/react-query';

export interface IComment {
  id: string;
  content: string;
  writerName: string;
  createdAt: string;
  isUpdated: boolean;
  likeCount: number;
  likedByMe: boolean;
  isMine: boolean;
  topChild: string;
}

export interface IReply {
  id: string;
  content: string;
  writerName: string;
  createdAt: string;
  isUpdated: boolean;
  likeCount: number;
  likedByMe: boolean;
  isMine: boolean;
  topChild: string;
}

export const commentQueries = {
  GET_COMMENT_LIST: (boardId: string) =>
    queryOptions<IComment[]>({
      queryKey: queryKeys.comment.list(boardId),
      queryFn: async () => {
        const res = await get<IComment[]>(END_POINT.COMMENT_BY_BOARD_ID(boardId));
        return res;
      },
    }),

  GET_REPLY_LIST: (parentId: string) =>
    queryOptions<IReply[]>({
      queryKey: queryKeys.comment.repliesList(parentId),
      queryFn: async () => {
        const res = await get<IReply[]>(END_POINT.COMMENT_REPLIES(parentId));
        return res;
      },
    }),
};
