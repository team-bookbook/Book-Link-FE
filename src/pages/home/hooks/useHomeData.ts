import { useState, useEffect } from 'react';
import type { IBookCard, IGroupCard, IHomeData } from '../types/home.types';
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

const groupNames = [
  '책과 함께하는 월요일',
  '소설 읽기 모임',
  '청춘 독서클럽',
  '함께 읽는 고전',
  '문학 토론방',
  '북카페 모임',
  '심야 독서회',
  '주말 책모임',
  '인문학 살롱',
  '베스트셀러 클럽',
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

export const generateDummyGroups = (count: number = 3): IGroupCard[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    groupName: groupNames[Math.floor(Math.random() * groupNames.length)],
    leaderName: '그룹장',
    memberCount: Math.floor(Math.random() * 10) + 5,
    description:
      '그룹에 대한 설명이 여기에 들어갑니다. 그룹에 대한 설명이 여기에 들어갑니다. 그룹에 대한 설명이 여기에 들어갑니다',
    imgurl: Math.random() > 0.3 ? sampleImages[Math.floor(Math.random() * sampleImages.length)] : '',
  }));
};

const fetchLoanData = async (): Promise<IBookCard[]> => {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return generateDummyBooks(5);
};

const fetchReservationData = async (): Promise<IBookCard[]> => {
  // await new Promise((resolve) => setTimeout(resolve, 1200));
  return generateDummyBooks(5);
};

const fetchGroupData = async (): Promise<IGroupCard[]> => {
  // await new Promise((resolve) => setTimeout(resolve, 800));
  return generateDummyGroups(3);
};

export const useHomeData = (): IHomeData => {
  const [loanData, setLoanData] = useState<IBookCard[]>([]);
  const [reservationData, setReservationData] = useState<IBookCard[]>([]);
  const [groupData, setGroupData] = useState<IGroupCard[]>([]);
  const [isLoadingLoans, setIsLoadingLoans] = useState(true);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loans, reservations, groups] = await Promise.allSettled([
          fetchLoanData(),
          fetchReservationData(),
          fetchGroupData(),
        ]);

        if (loans.status === 'fulfilled') {
          setLoanData(loans.value);
        } else {
          console.error('Failed to fetch loan data:', loans.reason);
        }
        setIsLoadingLoans(false);

        if (reservations.status === 'fulfilled') {
          setReservationData(reservations.value);
        } else {
          console.error('Failed to fetch reservation data:', reservations.reason);
        }
        setIsLoadingReservations(false);

        if (groups.status === 'fulfilled') {
          setGroupData(groups.value);
        } else {
          console.error('Failed to fetch group data:', groups.reason);
        }
        setIsLoadingGroups(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setIsLoadingLoans(false);
        setIsLoadingReservations(false);
        setIsLoadingGroups(false);
      }
    };

    loadData();
  }, []);

  return {
    loanData,
    reservationData,
    groupData,
    isLoadingLoans,
    isLoadingReservations,
    isLoadingGroups,
    error,
  };
};
