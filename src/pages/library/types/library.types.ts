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

export interface IBookDetail {
  id: number;
  title: string;
  author: string;
  publisher: string;
  library: string;
  maxDays: number;
  deposit: number;
  status: BookStatus;
  imgUrl?: string;
  genre?: string;
  price?: number;
  description?: string;
  latitude?: number;
  longitude?: number;
}
