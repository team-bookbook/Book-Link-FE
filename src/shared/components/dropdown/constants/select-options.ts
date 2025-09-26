export type LibSort = 'recent' | 'popular' | 'distance';
export type BookSort = 'recent' | 'popular';
export type RentStatus = 'pending' | 'confirmed' | 'stopped';

export const LIB_SORT_OPTIONS: ReadonlyArray<{ value: LibSort; label: string }> = [
  { value: 'recent', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'distance', label: '거리순' },
];

export const BOOK_SORT_OPTIONS: ReadonlyArray<{ value: BookSort; label: string }> = [
  { value: 'recent', label: '최신순' },
  { value: 'popular', label: '인기순' },
];

export const RENT_STATUS_OPTIONS: ReadonlyArray<{ value: RentStatus; label: string }> = [
  { value: 'pending', label: '대여 대기' },
  { value: 'confirmed', label: '대여 확정' },
  { value: 'stopped', label: '대여 중단' },
];
