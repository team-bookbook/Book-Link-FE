import { put } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { mutationKeys, queryKeys } from '@constants/query-keys';
import queryClient from '@libs/query-client';
import { mutationOptions } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export interface IUpdateMemberParams {
  nickname: string;
  address: string;
  phone: string;
  profileImage: string;
}

export const memberMutations = {
  UPDATE_ME: () =>
    mutationOptions<void, Error, IUpdateMemberParams>({
      mutationKey: mutationKeys.member.update,
      mutationFn: (data) =>
        put<void>(END_POINT.MEMBER_UPDATE, data, {
          headers: {
            'Trace-Id': uuidv4(),
          },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.member.me() });
      },
    }),
};
