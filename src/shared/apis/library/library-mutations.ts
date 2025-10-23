import { post } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { mutationKeys, queryKeys } from '@constants/query-keys';
import queryClient from '@libs/query-client';
import type { ILibrary } from '@pages/library/types/library.types';
import { mutationOptions } from '@tanstack/react-query';

interface ICreateLibraryParams {
  name: string;
  description: string;
  thumbnailUrl: string;
  startTime: string;
  endTime: string;
  address: string;
  latitude: number;
  longitude: number;
}

export const libraryMutations = {
  POST_LIBRARY: () =>
    mutationOptions<ILibrary, Error, ICreateLibraryParams>({
      mutationKey: mutationKeys.library.create,
      mutationFn: (data) => post<ILibrary>(END_POINT.LIBRARY, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.library.lists() });
      },
    }),
};
