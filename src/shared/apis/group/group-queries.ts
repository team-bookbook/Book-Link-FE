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

export interface IGroupMember {
  id: string;
  name: string;
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

  GET_GROUP_MEMBERS: (id: string) =>
    queryOptions<IGroupMember[]>({
      queryKey: queryKeys.group.memberList(id),
      queryFn: async () => {
        const res = await get<IGroupMember[]>(END_POINT.GROUP_MEMBERS(id));
        return res;
      },
    }),
};
