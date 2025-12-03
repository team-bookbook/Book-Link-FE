import { post } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { mutationKeys, queryKeys } from '@constants/query-keys';
import { mutationOptions, QueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export interface ICreateLibraryBookParams {
  id: string; // Book ID
  copies: number;
  deposit: number;
  previewImages: string[]; // JSON array string
}

export interface ICreateLibraryBookResponse {
  libraryBookId: string;
}

export const libraryBookMutations = {
  POST_LIBRARY_BOOK: (queryClient: QueryClient) =>
    mutationOptions<ICreateLibraryBookResponse, Error, ICreateLibraryBookParams>({
      mutationKey: mutationKeys.libraryBook.create,
      mutationFn: (data) =>
        post<ICreateLibraryBookResponse>(END_POINT.LIBRARY_BOOK, data, {
          headers: {
            'Trace-Id': uuidv4(),
          },
        }),
      onSuccess: () => {
        // Invalidate library book queries to refetch updated list
        queryClient.invalidateQueries({ queryKey: queryKeys.libraryBook.lists() });
      },
    }),
};
