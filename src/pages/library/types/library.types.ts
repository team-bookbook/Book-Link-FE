export type BookStatus = 'available' | 'rented' | 'reserved';

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

export interface ITopReview {
  reviewId: string;
  profileImage: string;
  nickname: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ILibrary {
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
  distanceKm: number;
  topReviews: ITopReview[];
}

export interface IPaginatedLibraryResponse {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  content: ILibrary[];
  hasNext: boolean;
  hasPrevious: boolean;
}

export type TLocation = {
  address: string;
  lat: number;
  lng: number;
};

export interface IBookScanData {
  isbn: string;
  bookInfo?: {
    id: string;
    title: string;
    author: string;
    publisher: string;
    category: string;
    originalPrice: number;
    publishedDate: string;
    foundInNationalLibrary: boolean;
  };
}
