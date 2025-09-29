import imgGift from '@images/onboarding-gift.svg';
import imgAlarm from '@images/onboarding-2.svg';
import imgDday from '@images/onboarding-3.svg';
import imgExplore from '@images/onboarding-4.svg';

export type SlideId = 'find-share' | 'alerts' | 'due' | 'explore';

export type OnboardingSlide = {
  id: 'find-share' | 'alerts' | 'due' | 'explore';
  title: string;
  subtitle: string;
  image: string;
};

export const ONBOARDING_PAGES: OnboardingSlide[] = [
  {
    id: 'find-share',
    title: 'BookLink에서 원하는 책을 찾고\n사람들과 공유해 보세요!',
    subtitle: '사진 몇 장으로 나만의 도서관을 바로 운영할 수 있어요.',
    image: imgGift,
  },
  {
    id: 'alerts',
    title: '중요한 소식은 알림을 통해\n빠르게 알려드릴게요.',
    subtitle: '댓글·대여 요청·공지까지 실시간으로 받아요.',
    image: imgAlarm,
  },
  {
    id: 'due',
    title: '자주 까먹는 반납 일자,\n언제든 확인할 수 있어요!',
    subtitle: 'D-1에 똑! 일정 맞춰 반납하면 신뢰가 쑥쑥.',
    image: imgDday,
  },
  {
    id: 'explore',
    title: '내 주변 도서 탐색을 빠르게,\n책·도서관 관리를 한 번에!',
    subtitle: '주변 도서를 탐색하고 바로 대여하세요.',
    image: imgExplore,
  },
];
