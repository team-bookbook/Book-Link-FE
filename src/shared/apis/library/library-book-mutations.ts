import { post, del, patch } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { mutationKeys, queryKeys } from '@constants/query-keys';
import queryClient from '@libs/query-client';
import { mutationOptions } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export interface ICreateLibraryBookParams {
  id: string;
  copies: number;
  deposit: number;
  previewImages: string[];
  description: string;
}

export interface IUpdateLibraryBookParams {
  id: string;
  copies: number;
  deposit: number;
  previewImages: string[];
  description: string;
}

export interface ICreateLibraryBookResponse {
  libraryBookId: string;
}

export const libraryBookMutations = {
  POST_LIBRARY_BOOK: () =>
    mutationOptions<ICreateLibraryBookResponse, Error, ICreateLibraryBookParams>({
      mutationKey: mutationKeys.libraryBook.create,
      mutationFn: (data) =>
        post<ICreateLibraryBookResponse>(END_POINT.LIBRARY_BOOK, data, {
          headers: {
            'Trace-Id': uuidv4(),
          },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.libraryBook.lists() });
      },
    }),

  PATCH_LIBRARY_BOOK: () =>
    mutationOptions<void, Error, IUpdateLibraryBookParams>({
      mutationKey: mutationKeys.libraryBook.update,
      mutationFn: ({ id, copies, deposit, previewImages }) =>
        patch<void>(
          END_POINT.LIBRARY_BOOK,
          {
            id,
            copies,
            deposit,
            previewImages,
          },
          {
            headers: {
              'Trace-Id': uuidv4(),
            },
          }
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.libraryBook.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.libraryBook.details() });
      },
    }),

  DELETE_LIBRARY_BOOK: (libraryBookId: string) =>
    mutationOptions<void, Error, void>({
      mutationKey: mutationKeys.libraryBook.delete,
      mutationFn: () =>
        del<void>(END_POINT.LIBRARY_BOOK_BY_ID(libraryBookId), {
          headers: {
            'Trace-Id': uuidv4(),
          },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.libraryBook.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.libraryBook.details() });
      },
    }),
};
