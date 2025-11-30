export const queryKeys = {
  library: {
    all: ['library'] as const,
    lists: () => [...queryKeys.library.all, 'list'] as const,
    list: (params: { lat: number; lng: number; libraryName?: string; page?: number; size?: number }) =>
      [...queryKeys.library.lists(), params] as const,
    details: () => [...queryKeys.library.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.library.details(), id] as const,
    reviews: () => [...queryKeys.library.all, 'review'] as const,
    review: (id: string) => [...queryKeys.library.reviews(), id] as const,
    rating: (id: string) => [...queryKeys.library.all, 'rating', id] as const,
  },

  libraryBook: {
    all: ['library-book'] as const,
    lists: () => [...queryKeys.libraryBook.all, 'list'] as const,
    list: (params: {
      latitude: number;
      longitude: number;
      page: number;
      size: number;
      bookName?: string;
      sortType?: string;
    }) => [...queryKeys.libraryBook.lists(), params] as const,
  },

  book: {
    all: ['book'] as const,
    details: () => [...queryKeys.book.all, 'detail'] as const,
    detail: (isbn: string) => [...queryKeys.book.details(), isbn] as const,
  },

  member: {
    all: ['member'] as const,
    me: () => [...queryKeys.member.all, 'me'] as const,
  },

  notification: {
    all: ['notification'] as const,
    lists: () => [...queryKeys.notification.all, 'list'] as const,
  },
} as const;

export const mutationKeys = {
  auth: {
    login: ['auth', 'login'] as const,
    logout: ['auth', 'logout'] as const,
    signup: ['auth', 'signup'] as const,
    reissue: ['auth', 'reissue'] as const,
  },
  library: {
    create: ['library', 'create'] as const,
    update: ['library', 'update'] as const,
    delete: ['library', 'delete'] as const,
    reviewCreate: ['library', 'review', 'create'] as const,
    reviewUpdate: ['library', 'review', 'update'] as const,
    reviewDelete: ['library', 'review', 'delete'] as const,
  },
  libraryBook: {
    create: ['library-book', 'create'] as const,
  },
  member: {
    update: ['member', 'update'] as const,
  },
  book: {
    create: ['book', 'create'] as const,
  },
} as const;
