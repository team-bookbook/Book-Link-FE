import { post, del, put } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { mutationKeys, queryKeys } from '@constants/query-keys';
import queryClient from '@libs/query-client';
import { mutationOptions } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export interface ICreateLibraryParams {
  name: string;
  description: string;
  thumbnailUrl: string;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
  validOperatingHours: boolean;
}

export interface IUpdateLibraryParams {
  libraryId: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  startTime: string;
  endTime: string;
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

  PUT_LIBRARY: () =>
    mutationOptions<void, Error, IUpdateLibraryParams>({
      mutationKey: mutationKeys.library.update,
      mutationFn: (data) =>
        put<void>(END_POINT.LIBRARY, data, {
          headers: {
            'Trace-Id': uuidv4(),
          },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.library.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.library.details() });
      },
    }),

  DELETE_LIBRARY: () =>
    mutationOptions<void, Error, string>({
      mutationKey: mutationKeys.library.delete,
      mutationFn: (libraryId) =>
        del<void>(END_POINT.LIBRARY_BY_ID(libraryId), {
          headers: {
            'Trace-Id': uuidv4(),
          },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.library.lists() });
      },
    }),
};
