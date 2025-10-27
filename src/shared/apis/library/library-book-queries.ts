import { get } from '@apis/base/client';
import type { BookSort } from '@components/dropdown/constants/select-options';
import { END_POINT } from '@constants/end-point';
import { queryKeys } from '@constants/query-keys';
import type { ILibraryBook } from '@pages/library/types/library.types';
import { queryOptions } from '@tanstack/react-query';

interface ILibraryBookParams {
  latitude: number;
  longitude: number;
  page: number;
  size: number;
  bookName?: string;
  sortType?: BookSort;
}

interface IgetLibraryBook {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  content: ILibraryBook[];
  hasNext: boolean;
  hasPrevious: boolean;
}

export const libraryBookQueries = {
  GET_LIBRARY_BOOK: (params: ILibraryBookParams) =>
    queryOptions<IgetLibraryBook>({
      queryKey: queryKeys.libraryBook.list(params),
      queryFn: async () => {
        const res = await get<IgetLibraryBook>(END_POINT.LIBRARY_BOOK, {
          params,
        });
        return res;
      },
    }),
};
