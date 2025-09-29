import { useState, useEffect } from 'react';
import type { IBookCard, IGroupCard, IHomeData } from '../types/home.types';

const generateDummyBooks = (count: number = 7): IBookCard[] => {
  return Array.from({ length: count }, (_, index) => ({
    imgurl: '',
    index: index,
    id: index + 1,
    title: `책 제목 ${index + 1}`,
    author: `작가명 ${index + 1}`,
    expDate: '22.12.31',
  }));
};

const generateDummyGroups = (count: number = 3): IGroupCard[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    groupName: `독서 모임 ${index + 1}`,
    leaderName: '그룹장',
    memberCount: Math.floor(Math.random() * 10) + 5,
    description: '그룹에 대한 설명이 여기에 들어갑니다. 그룹에 대한 설명이 여기에 들어갑니다.',
    imgurl: '',
  }));
};

const fetchLoanData = async (): Promise<IBookCard[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return generateDummyBooks(5);
};

const fetchReservationData = async (): Promise<IBookCard[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return generateDummyBooks(5);
};

const fetchGroupData = async (): Promise<IGroupCard[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
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
