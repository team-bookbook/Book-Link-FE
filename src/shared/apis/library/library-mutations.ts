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

export interface IUpdateReviewParams {
  reviewId: string;
  rating: number;
  comment: string;
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

  PUT_LIBRARY_REVIEW: () =>
    mutationOptions<boolean, Error, IUpdateReviewParams>({
      mutationKey: mutationKeys.library.reviewUpdate,
      mutationFn: ({ reviewId, rating, comment }) =>
        put<boolean>(
          END_POINT.REVIEW_BY_REVIEW_ID(reviewId),
          { rating, comment },
          {
            headers: {
              'Trace-Id': uuidv4(),
            },
          }
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.library.reviews() });
        // 추후 좋아요 쿼리키 생성시 초기화
      },
    }),

  DELETE_LIBRARY_REVIEW: () =>
    mutationOptions<void, Error, string>({
      mutationKey: mutationKeys.library.reviewDelete,
      mutationFn: (reviewId) =>
        del<void>(END_POINT.REVIEW_BY_REVIEW_ID(reviewId), {
          headers: {
            'Trace-Id': uuidv4(),
          },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.library.reviews() });
      },
    }),
};
