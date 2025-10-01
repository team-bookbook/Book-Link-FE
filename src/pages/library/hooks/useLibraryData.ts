import { useState, useEffect } from 'react';
import type { ILibraryBook, ILibraryData, BookStatus } from '@pages/library/types/library.types';

const sampleImages = [
  'https://picsum.photos/200/300?random=1',
  'https://picsum.photos/200/300?random=2',
  'https://picsum.photos/200/300?random=3',
  'https://picsum.photos/200/300?random=4',
  'https://picsum.photos/200/300?random=5',
  'https://picsum.photos/200/300?random=6',
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
];

const authors = [
  '무라카미 하루키',
  '조지 오웰',
  '생텍쥐페리',
  'J.K. 롤링',
  '헤르만 헤세',
  '도스토예프스키',
  'F. 스콧 피츠제럴드',
];

const libraries = ['OO 도서관', '서울 중앙도서관', '용산도서관', '강남도서관', '마포도서관'];

const bookStatuses: BookStatus[] = ['available', 'rented', 'reserved'];

export const generateDummyLibraryBooks = (count: number = 10): ILibraryBook[] => {
  return Array.from({ length: count }, (_, index) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) + 1);

    return {
      id: index + 1,
      title: bookTitles[Math.floor(Math.random() * bookTitles.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      library: libraries[Math.floor(Math.random() * libraries.length)],
      dueDate: dueDate.toISOString().split('T')[0].replace(/-/g, '.'),
      maxDays: 30,
      deposit: 500,
      status: bookStatuses[Math.floor(Math.random() * bookStatuses.length)],
      imgUrl: Math.random() > 0.3 ? sampleImages[Math.floor(Math.random() * sampleImages.length)] : undefined,
    };
  });
};

const fetchLibraryBooks = async (): Promise<ILibraryBook[]> => {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return generateDummyLibraryBooks(8);
};

export const useLibraryData = (): ILibraryData => {
  const [books, setBooks] = useState<ILibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const libraryBooks = await fetchLibraryBooks();
        setBooks(libraryBooks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    books,
    isLoading,
    error,
  };
};
