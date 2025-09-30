export type BookStatus = 'available' | 'rented' | 'reserved';

export interface ILibraryBook {
  id: number;
  title: string;
  author: string;
  library: string;
  dueDate: string;
  maxDays: number;
  deposit: number;
  status: BookStatus;
  imgUrl?: string;
}

export interface ILibraryData {
  books: ILibraryBook[];
  isLoading: boolean;
  error: string | null;
}
