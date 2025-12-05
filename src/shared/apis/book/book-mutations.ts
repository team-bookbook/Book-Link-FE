import { post } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { mutationKeys } from '@constants/query-keys';
import { mutationOptions } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export interface ICreateBookParams {
  title: string;
  author: string;
  publisher: string;
  category: string;
  originalPrice: number;
  publishedDate: string;
  isbn: string;
}

export const bookMutations = {
  POST_BOOK: () =>
    mutationOptions<string, Error, ICreateBookParams>({
      mutationKey: mutationKeys.book.create,
      mutationFn: (data) =>
        post<string>(END_POINT.BOOK, data, {
          headers: {
            'Trace-Id': uuidv4(),
          },
        }),
    }),
};
