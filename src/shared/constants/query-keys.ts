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

  member: {
    all: ['member'] as const,
    me: () => [...queryKeys.member.all, 'me'] as const,
  },

  board: {
    all: ['board'] as const,
    lists: () => [...queryKeys.board.all, 'list'] as const,
    list: (params: { title?: string; category?: string }) => [...queryKeys.board.lists(), params] as const,
    details: () => [...queryKeys.board.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.board.details(), id] as const,
    likes: () => [...queryKeys.board.all, 'like'] as const,
    like: (id: string) => [...queryKeys.board.likes(), id] as const,
  },

  comment: {
    all: ['comment'] as const,
    lists: () => [...queryKeys.comment.all, 'list'] as const,
    list: (boardId: string) => [...queryKeys.comment.lists(), boardId] as const,
    repliesLists: () => [...queryKeys.comment.all, 'replies'] as const,
    repliesList: (parentId: string) => [...queryKeys.comment.repliesLists(), parentId] as const,
  },

  group: {
    all: ['group'] as const,
    lists: () => [...queryKeys.group.all, 'list'] as const,
    list: (params: { name?: string }) => [...queryKeys.group.lists(), params] as const,
    details: () => [...queryKeys.group.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.group.details(), id] as const,
    members: () => [...queryKeys.group.all, 'members'] as const,
    memberList: (id: string) => [...queryKeys.group.members(), id] as const,
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
  member: {
    update: ['member', 'update'] as const,
  },
  board: {
    create: ['board', 'create'] as const,
    update: ['board', 'update'] as const,
    delete: ['board', 'delete'] as const,
    like: ['board', 'like'] as const,
  },
  comment: {
    create: ['comment', 'create'] as const,
    like: ['comment', 'like'] as const,
    delete: ['comment', 'delete'] as const,
  },
  group: {
    create: ['group', 'create'] as const,
  },
} as const;
