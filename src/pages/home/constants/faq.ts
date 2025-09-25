import { type FaqItem } from '@pages/home/components/faq/faq';

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'q1',
    question: '어떻게 책을 등록하나요?',
    answer:
      '사진 촬영(인식)을 통해 등록할 수 있습니다. 인식이 되지 않을 경우에는, ISBN을 직접 입력해서 등록할 수 있습니다!',
    defaultOpen: false,
  },
  {
    id: 'q2',
    question: '모임을 어떻게 생성하나요?',
    answer:
      '하단 내비게이션 바에서 [게시판]을 클릭하면 게시판 페이지로 이동할 수 있습니다. 해당 페이지의 [모임] 탭으로 이동하면 모임 이름, 설명 등을 입력하여 모임을 생성할 수 있습니다.',
    defaultOpen: false,
  },
];
