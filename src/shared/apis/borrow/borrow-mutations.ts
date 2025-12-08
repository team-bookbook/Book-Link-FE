import { post } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { mutationKeys } from '@constants/query-keys';
import { mutationOptions } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export interface ICreateBorrowParams {
  libraryBookId: string;
  expectedReturnDate: string;
  chatId: string;
}

export interface ICreateBorrowResponse {
  borrowId: string;
}

export const borrowMutations = {
  POST_BORROW: () =>
    mutationOptions<ICreateBorrowResponse, Error, ICreateBorrowParams>({
      mutationKey: mutationKeys.borrow.create,
      mutationFn: ({ libraryBookId, expectedReturnDate, chatId }) =>
        post<ICreateBorrowResponse>(
          `${END_POINT.BORROWS}?chatId=${chatId}`,
          {
            libraryBookId,
            expectedReturnDate,
          },
          {
            headers: {
              'Trace-Id': uuidv4(),
            },
          }
        ),
    }),
};
