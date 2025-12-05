import { get } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { queryKeys } from '@constants/query-keys';
import type { ILibrary, IPaginatedLibraryResponse } from '@pages/library/types/library.types';
import type { IReview } from '@pages/library/types/review.types';
import { queryOptions } from '@tanstack/react-query';

interface ILibraryParams {
  lat: number;
  lng: number;
  libraryName?: string;
  page?: number;
  size?: number;
}

export const libraryQueries = {
  GET_LIBRARY: (params: ILibraryParams) =>
    queryOptions<IPaginatedLibraryResponse>({
      queryKey: queryKeys.library.list(params),
      queryFn: async () => {
        const res = await get<IPaginatedLibraryResponse>(END_POINT.LIBRARY, {
          params,
        });
        return res;
      },
    }),

  GET_LIBRARY_DETAIL: (id: string) =>
    queryOptions<ILibrary>({
      queryKey: queryKeys.library.detail(id),
      queryFn: async () => {
        const res = await get<ILibrary>(END_POINT.LIBRARY_BY_ID(id));
        return res;
      },
      enabled: !!id,
    }),

  GET_LIBRARY_REVIEW: (library_id: string) =>
    queryOptions<IReview[]>({
      queryKey: queryKeys.library.review(library_id),
      queryFn: async () => {
        const res = await get<IReview[]>(END_POINT.REVIEW_BY_LIBRARY_ID(library_id));
        return res;
      },
      enabled: !!library_id,
    }),

  GET_LIBRARY_REVIEW_AVG: (library_id: string) =>
    queryOptions<number>({
      queryKey: queryKeys.library.rating(library_id),
      queryFn: async () => {
        const res = await get<number>(END_POINT.REVIEW_RATING_BY_ID(library_id));
        return res;
      },
      enabled: !!library_id,
    }),
};
