import { get } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import type { ILibrary } from '@pages/library/types/library.types';
import { queryOptions } from '@tanstack/react-query';

interface ILibraryParams {
  lat: number;
  lng: number;
  libraryName?: string;
  page?: number;
  size?: number;
}

// interface IgetLibrary {
//   totalElements: number;
//   totalPages: number;
//   currentPage: number;
//   pageSize: number;
//   content: ILibrary[];
//   hasNext?: boolean;
//   hasPrevious?: boolean;
// }

export const libraryQueries = {
  GET_LIBRARY: (params: ILibraryParams) =>
    queryOptions<ILibrary[]>({
      queryKey: ['GET_LIBRARY', params],
      queryFn: async () => {
        const res = await get<ILibrary[]>(END_POINT.LIBRARY, {
          params,
        });
        return res;
      },
    }),
};
