import { useState, useEffect } from 'react';
import type { ILibraryBook } from '@pages/library/types/library.types';

const sampleImages = [
  'https://picsum.photos/200/300?random=1',
  'https://picsum.photos/200/300?random=2',
  'https://picsum.photos/200/300?random=3',
  'https://picsum.photos/200/300?random=4',
];

const bookTitles = [
  'IQ84',
  '노르웨이의 숲',
  '1984',
  '어린왕자',
  '해리포터와 마법사의 돌',
  '데미안',
  '카라마조프 가의 형제들',
  '위대한 개츠비',
  '살인자의 기억법',
  '82년생 김지영',
  '코스모스',
  '사피엔스',
];

const authors = [
  '무라카미 하루키',
  '조지 오웰',
  '생텍쥐페리',
  'J.K. 롤링',
  '헤르만 헤세',
  '도스토예프스키',
  'F. 스콧 피츠제럴드',
  '김영하',
  '조남주',
  '칼 세이건',
  '유발 하라리',
];

const libraries = ['북북 도서관', '서울 도서관', '강남 도서관', '홍대 도서관'];

const statuses: Array<'available' | 'rented' | 'reserved'> = ['available', 'rented', 'reserved'];

const generateDummyLibraryBooks = (count: number = 7): ILibraryBook[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: bookTitles[Math.floor(Math.random() * bookTitles.length)],
    author: authors[Math.floor(Math.random() * authors.length)],
    library: libraries[Math.floor(Math.random() * libraries.length)],
    dueDate: `${Math.floor(Math.random() * 12) + 1}월 ${Math.floor(Math.random() * 28) + 1}일 ~ ${Math.floor(Math.random() * 12) + 1}월 ${Math.floor(Math.random() * 28) + 1}일`,
    maxDays: Math.floor(Math.random() * 30) + 7,
    deposit: Math.floor(Math.random() * 5) * 1000 + 3000,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    imgUrl: Math.random() > 0.3 ? sampleImages[Math.floor(Math.random() * sampleImages.length)] : undefined,
  }));
};

const fetchLibraryBooks = async (): Promise<ILibraryBook[]> => {
  // await new Promise((resolve) => setTimeout(resolve, 800));
  return generateDummyLibraryBooks(7);
};

export const useLibraryBooks = () => {
  const [books, setBooks] = useState<ILibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchLibraryBooks();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []);

  return { books, isLoading, error };
};
