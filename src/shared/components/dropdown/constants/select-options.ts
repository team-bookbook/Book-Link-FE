export type BookSort = 'DISTANCE' | 'LATEST' | 'MOST_BORROWED';
export type RentStatus = 'pending' | 'confirmed' | 'stopped';
export type BookCategory = 'all' | '000' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type BookCategoryLabel =
  | '카테고리 전체'
  | '총류'
  | '철학'
  | '종교'
  | '사회과학'
  | '자연과학'
  | '기술과학'
  | '예술'
  | '언어(어학)'
  | '문학'
  | '역사';
export type ReviewManage = 'modify' | 'delete';

export const BOOK_SORT_OPTIONS: ReadonlyArray<{ value: BookSort; label: string }> = [
  { value: 'DISTANCE', label: '거리순' },
  { value: 'LATEST', label: '최신순' },
  { value: 'MOST_BORROWED', label: '인기순' },
];

export const RENT_STATUS_OPTIONS: ReadonlyArray<{ value: RentStatus; label: string }> = [
  { value: 'pending', label: '대여 대기' },
  { value: 'confirmed', label: '대여 확정' },
  { value: 'stopped', label: '대여 중단' },
];

export const BOOK_CATEGORY_OPTIONS: ReadonlyArray<{ value: BookCategory; label: BookCategoryLabel }> = [
  { value: 'all', label: '카테고리 전체' },
  { value: '000', label: '총류' },
  { value: '100', label: '철학' },
  { value: '200', label: '종교' },
  { value: '300', label: '사회과학' },
  { value: '400', label: '자연과학' },
  { value: '500', label: '기술과학' },
  { value: '600', label: '예술' },
  { value: '700', label: '언어(어학)' },
  { value: '800', label: '문학' },
  { value: '900', label: '역사' },
];

export const REVIEW_MANAGE_OPTIONS: ReadonlyArray<{ value: ReviewManage; label: string }> = [
  { value: 'modify', label: '수정하기' },
  { value: 'delete', label: '삭제하기' },
];

export const COMMENT_MANAGE_OPTIONS: ReadonlyArray<{ value: ReviewManage; label: string }> = [
  { value: 'delete', label: '삭제하기' },
];
