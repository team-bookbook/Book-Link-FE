export type BookStatus = 'available' | 'rented' | 'reserved';
export type TBookSort = 'DISTANCE' | 'LATEST' | 'MOST_BORROWED';

export interface ILibraryBook {
  imageUrl: string;
  id: string;
  title: string;
  author: string;
  libraryName: string;
  distance: number;
  copies: number;
  borrowedCount: number;
  deposit: number;
  rentedOut: boolean;
  expectedReturnDate: string;
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

export type ILibrary = {
  id: string;
  name: string;
  description: string;
  stars: number;
  likeCount: number;
  bookCount: number;
  createdAt: string;
  thumbnailUrl: string;
  startTime: string;
  endTime: string;
  topBooks: Array<{
    bookId: string;
    title: string;
    author: string;
    publisher: string;
    category: string;
  }>;
};
