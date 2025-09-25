export type EmptyKey = 'send' | 'cart' | 'notification' | 'search';

export type EmptyTips = {
  title: string;
  items: string[];
};

export type EmptyContent = {
  title: string;
  description?: string;
  image: string;
  tips?: EmptyTips;
};

import ImgCart from '@images/empty-cart.svg';
import ImgNotification from '@images/empty-notification.svg';
import ImgSearch from '@images/empty-search.svg';
import ImgSend from '@images/send.svg';

export const EMPTY_CONTENT_MAP: Record<EmptyKey, EmptyContent> = {
  cart: {
    title: '장바구니가 비었습니다',
    description: '새로운 도서를 담아보세요!',
    image: ImgCart,
  },
  send: {
    title: '메일이 전송되었습니다!',
    description: '메일로 전송된 링크를 통해\n새로운 비밀번호로 변경해 주세요.',
    image: ImgSend,
  },
  notification: {
    title: '알림이 없습니다',
    description: '새로운 소식이 생기면 알려드릴게요!',
    image: ImgNotification,
  },
  search: {
    title: '검색 결과가 없습니다',
    image: ImgSearch,
    tips: {
      title: '확인해 주세요',
      items: [
        '단어의 철자가 정확한지 확인해 주세요.',
        '보다 일반적인 단어로 다시 검색해 보세요.',
        '검색하신 도서/도서관이 BookLink에 없을 수 있습니다.',
      ],
    },
  },
};

export function getEmptyContent(key: EmptyKey): EmptyContent {
  return EMPTY_CONTENT_MAP[key];
}
