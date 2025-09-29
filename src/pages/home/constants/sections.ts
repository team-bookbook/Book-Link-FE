export type SectionCopy = {
  title: string;
  description: string;
};

export type SectionTitles = {
  loan: string;
  reservation: string;
  group: string;
};

export const HOME_SECTIONS: {
  howTo: SectionCopy;
  faq: SectionCopy;
} = {
  howTo: {
    title: '서비스 이용 방법',
    description: '간단한 단계로 도서관을 운영하세요!',
  },
  faq: {
    title: '자주 묻는 질문',
    description: '자주 묻는 질문을 확인해 보세요!',
  },
};

export const HOME_SECTION_TITLES: SectionTitles = {
  loan: '대여 현황',
  reservation: '예약 내역',
  group: '내가 속한 모임',
};
