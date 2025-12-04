import { post } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { mutationKeys } from '@constants/query-keys';
import { mutationOptions } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export interface ICreateGroupParams {
  thumbnail?: string;
  name: string;
  description: string;
  maxCapacity: number;
  password?: string;
}

export const groupMutations = {
  POST_CREATE_GROUP: () =>
    mutationOptions<string, Error, ICreateGroupParams>({
      mutationKey: mutationKeys.group.create,
      mutationFn: (data) =>
        post<string>(END_POINT.GROUP, data, {
          headers: {
            'Trace-Id': uuidv4(),
          },
        }),
    }),
};
