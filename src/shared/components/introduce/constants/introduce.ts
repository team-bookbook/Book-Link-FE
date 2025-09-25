export type IntroduceVariant = 'peach' | 'pink' | 'purple' | 'sky';

export type IntroduceItem = {
  id: string;
  title: string;
  stepText: string;
  variant: IntroduceVariant;
};

export const INTRODUCE_STEPS: IntroduceItem[] = [
  {
    id: 'step-1',
    title: '사진 촬영 또는 ISBN 입력으로\n쉽게 책을 등록하세요',
    stepText: '1단계: 책 등록',
    variant: 'peach',
  },
  {
    id: 'step-2',
    title: '지도에서 가까운 도서를\n찾아보세요',
    stepText: '2단계: 도서 검색',
    variant: 'pink',
  },
  {
    id: 'step-3',
    title: '간단한 신청 후 소유자와\n교환하세요',
    stepText: '3단계: 대여 신청',
    variant: 'purple',
  },
  {
    id: 'step-4',
    title: '지정된 장소에서 다시 반납하면\n됩니다',
    stepText: '4단계: 대여 후 반납',
    variant: 'sky',
  },
];
