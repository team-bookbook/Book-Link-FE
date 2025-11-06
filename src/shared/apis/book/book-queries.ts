import { get } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { queryKeys } from '@constants/query-keys';
import { queryOptions } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export interface IBookInfo {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  originalPrice: number;
  publishedDate: string;
  foundInNationalLibrary: boolean;
  isbn: string;
}

export const bookQueries = {
  GET_BOOK_BY_ISBN: (isbn: string) =>
    queryOptions<IBookInfo>({
      queryKey: queryKeys.book.detail(isbn),
      queryFn: async () => {
        const res = await get<IBookInfo>(END_POINT.BOOK_BY_ISBN(isbn), {
          headers: {
            'Trace-Id': uuidv4(),
          },
        });
        return res;
      },
      enabled: !!isbn,
    }),
};
