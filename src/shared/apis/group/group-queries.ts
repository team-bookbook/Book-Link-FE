import { get } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { queryKeys } from '@constants/query-keys';
import { queryOptions } from '@tanstack/react-query';

export interface IGroup {
  id: string;
  thumbnail: string;
  name: string;
  participantCount: number;
  maxCapacity: number;
  isPrivate: boolean;
}

interface IGroupListParams {
  name?: string;
}

export const groupQueries = {
  GET_GROUP_LIST: (params: IGroupListParams = {}) =>
    queryOptions<IGroup[]>({
      queryKey: queryKeys.group.list(params),
      queryFn: async () => {
        const res = await get<IGroup[]>(END_POINT.GROUP, {
          params,
        });
        return res;
      },
    }),
};
