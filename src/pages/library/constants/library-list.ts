export const LIBRARY_LIST_LABELS = {
  recommended: '추천',
  favorite: '즐겨찾기',
  myLibrary: '내 도서관',
} as const;

export type LibraryListTab = 'recommended' | 'favorite';

export const LIBRARY_LIST_TABS: LibraryListTab[] = ['recommended', 'favorite'];
