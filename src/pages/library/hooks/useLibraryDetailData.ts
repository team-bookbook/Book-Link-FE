import { useState, useEffect } from 'react';
import type { IBookCard } from '@pages/home/types/home.types';
import type { IReview } from '@pages/library/types/review.types';

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

const nicknames = ['책벌레', 'bookLover', '독서광', '북북이', '책마니아', '리더스클럽', '문학소녀'];

const reviewContents = [
  '너무 읽고 싶었던 책인데 구하기 어려워서 그동안 못 읽었어요. 이번에 대여해 주신 덕분에 소원 성취했습니다! 한 번 더 읽고 싶어서 연장 요청드렸더니 수락해 주셔서 정말 감사했습니다. 도서관장님 적게 일하고 많이 버세요! 그렇다고 너무 잘되시면 배아프니까 적당히만 잘되세요!',
  '정말 좋은 책이었어요. 도서관장님께 감사드립니다. 다음에도 또 대여하고 싶습니다.',
  '책 상태도 좋고 대여 과정도 간편했습니다. 추천합니다!',
  '너무 읽고 싶었던 책인데 구하기 어려워서 그동안 못 읽었어요. 이번에 대여해 주신 덕분에 소원 성취했습니다! 한 번 더 읽고 싶어서 연장 요청드렸더니 수락해 주셔서 정말 감사했습니다. 도서관장님 적게 일하고 많이 버세요! 그렇다고 너무 잘되시면 배아프니까 적당히만 잘되세요!',
  '기대했던 책인데 실망하지 않았어요. 좋은 책 보유해 주셔서 감사합니다.',
];

export const generateDummyBooks = (count: number = 7): IBookCard[] => {
  return Array.from({ length: count }, (_, index) => ({
    imgurl: Math.random() > 0.3 ? sampleImages[Math.floor(Math.random() * sampleImages.length)] : '',
    index: index,
    id: index + 1,
    title: bookTitles[Math.floor(Math.random() * bookTitles.length)],
    author: authors[Math.floor(Math.random() * authors.length)],
    expDate: Math.floor(Math.random() * 10) + 1,
  }));
};

export const generateDummyReviews = (count: number = 5): IReview[] => {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    return {
      id: index + 1,
      nickname: nicknames[Math.floor(Math.random() * nicknames.length)],
      rating: Math.floor(Math.random() * 3) + 3, // 3-5점
      date: date.toISOString().split('T')[0],
      content: reviewContents[Math.floor(Math.random() * reviewContents.length)],
      profileImgUrl: Math.random() > 0.5 ? sampleImages[Math.floor(Math.random() * sampleImages.length)] : undefined,
    };
  });
};

const fetchBookData = async (): Promise<IBookCard[]> => {
  // await new Promise((resolve) => setTimeout(resolve, 800));
  return generateDummyBooks(7);
};

const fetchReviewData = async (): Promise<IReview[]> => {
  // await new Promise((resolve) => setTimeout(resolve, 800));
  return generateDummyReviews(5);
};

export interface ILibraryInfo {
  name: string;
  hours: string;
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  imageUrl?: string;
  description: {
    title: string;
    content: string;
  };
  reward: {
    title: string;
    pointLabel: string;
    pointDescription: string;
  };
}

const fetchLibraryInfo = async (): Promise<ILibraryInfo> => {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    name: '예제 도서관',
    hours: '영업시간 : 08:00 ~ 24:00, 월화수목금',
    rating: 4.8,
    reviewCount: 100,
    favoriteCount: 256,
    imageUrl: 'https://picsum.photos/800/480?random=library', // 이미지가 있는 경우
    description: {
      title: '우리 도서관을 소개합니다!',
      content: '여기에 도서관 소개글이 작성됩니다. 도서관 소유자가 자유롭게 도서관 소개글을 작성할 수 있습니다.',
    },
    reward: {
      title: '혜택안내',
      pointLabel: '포인트 적립',
      pointDescription: '1% BookLink 포인트 적립',
    },
  };
};

export interface ILibraryDetailData {
  libraryInfo: ILibraryInfo | null;
  bookData: IBookCard[];
  reviewData: IReview[];
  isLoadingLibraryInfo: boolean;
  isLoadingBooks: boolean;
  isLoadingReviews: boolean;
  error: string | null;
}

export const useLibraryDetailData = (): ILibraryDetailData => {
  const [libraryInfo, setLibraryInfo] = useState<ILibraryInfo | null>(null);
  const [bookData, setBookData] = useState<IBookCard[]>([]);
  const [reviewData, setReviewData] = useState<IReview[]>([]);
  const [isLoadingLibraryInfo, setIsLoadingLibraryInfo] = useState(true);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [library, books, reviews] = await Promise.allSettled([
          fetchLibraryInfo(),
          fetchBookData(),
          fetchReviewData(),
        ]);

        if (library.status === 'fulfilled') {
          setLibraryInfo(library.value);
        } else {
          console.error('Failed to fetch library info:', library.reason);
        }
        setIsLoadingLibraryInfo(false);

        if (books.status === 'fulfilled') {
          setBookData(books.value);
        } else {
          console.error('Failed to fetch book data:', books.reason);
        }
        setIsLoadingBooks(false);

        if (reviews.status === 'fulfilled') {
          setReviewData(reviews.value);
        } else {
          console.error('Failed to fetch review data:', reviews.reason);
        }
        setIsLoadingReviews(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setIsLoadingLibraryInfo(false);
        setIsLoadingBooks(false);
        setIsLoadingReviews(false);
      }
    };

    loadData();
  }, []);

  return {
    libraryInfo,
    bookData,
    reviewData,
    isLoadingLibraryInfo,
    isLoadingBooks,
    isLoadingReviews,
    error,
  };
};
