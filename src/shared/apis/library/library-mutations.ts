import { post } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { mutationKeys, queryKeys } from '@constants/query-keys';
import queryClient from '@libs/query-client';
import { mutationOptions } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

interface ICreateLibraryParams {
  name: string;
  description: string;
  thumbnailUrl: string;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
  validOperatingHours: boolean;
}

export const libraryMutations = {
  POST_LIBRARY: () =>
    mutationOptions<string, Error, ICreateLibraryParams>({
      mutationKey: mutationKeys.library.create,
      mutationFn: (data) =>
        post<string>(END_POINT.LIBRARY, data, {
          headers: {
            'Trace-id': uuidv4(),
          },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.library.lists() });
      },
    }),
};
