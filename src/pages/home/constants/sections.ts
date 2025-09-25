export type SectionCopy = {
  title: string;
  description: string;
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
