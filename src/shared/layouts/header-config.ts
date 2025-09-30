import type { HeaderProps } from '@layouts/header';
import { matchPath } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';

type Rule = (path: string, search: string) => HeaderProps | undefined;

// 홈
const homeRule: Rule = (path) =>
  matchPath({ path: ROUTES.HOME, end: true }, path)
    ? { left: 'logo', actions: ['search', 'cart', 'bell'], notificationCount: 0, searchMode: false, safeTop: true }
    : undefined;

// 로그인
const loginRule: Rule = (path) =>
  matchPath({ path: ROUTES.LOGIN, end: true }, path)
    ? {
        left: 'back',
        rightTextCTA: { kind: 'link', label: '회원가입', to: ROUTES.SIGNUP },
        safeTop: true,
      }
    : undefined;

// 회원가입
const signupRule: Rule = (path) =>
  matchPath({ path: ROUTES.SIGNUP, end: true }, path)
    ? {
        left: 'back',
        rightTextCTA: { kind: 'link', label: '로그인', to: ROUTES.LOGIN },
        safeTop: true,
      }
    : undefined;

// 게시판
const boardRule: Rule = (path) =>
  matchPath({ path: ROUTES.BOARD, end: true }, path)
    ? { title: '게시판', actions: ['search', 'bell'], notificationCount: 8, safeTop: true }
    : undefined;

// 라이브러리 기본
const libraryRootRule: Rule = (path) => {
  if (!matchPath({ path: ROUTES.LIBRARY, end: true }, path)) return undefined;
  return {
    left: 'back',
    title: undefined,
    searchMode: true,
    searchPlaceholder: '도서관명/도서명으로 검색',
    safeTop: true,
  };
};

// 라이브러리 상세
const libraryDetailRule: Rule = (path) =>
  matchPath(`${ROUTES.LIBRARY}/:id`, path) ? { left: 'back', title: '도서관 이름', safeTop: true } : undefined;

// 설정 (마이페이지)
const settingRule: Rule = (path) =>
  matchPath({ path: ROUTES.SETTING, end: true }, path)
    ? { title: '마이페이지', actions: ['logout', 'bell'], safeTop: true }
    : undefined;

// 알림 목록
const notiRole: Rule = (path) =>
  ROUTES.NOTIFICATION && matchPath({ path: ROUTES.NOTIFICATION, end: true }, path)
    ? { left: 'back', title: '알림' }
    : undefined;

// 채팅 목록
const chatRule: Rule = (path) =>
  ROUTES.CHAT && matchPath({ path: ROUTES.CHAT, end: true }, path)
    ? { title: '채팅', actions: ['bell'], notificationCount: 8, safeTop: true }
    : undefined;

// 채팅 상세
const chatDetailRule: Rule = (path) => {
  const pattern = typeof ROUTES.CHAT_ROOM === 'function' ? ROUTES.CHAT_ROOM(':id') : `${ROUTES.CHAT}/:id`;

  return matchPath({ path: pattern, end: true }, path)
    ? { left: 'back', title: '사용자 이름', actions: ['logout', 'kebab'], safeTop: true }
    : undefined;
};

// 나의 예약 내역
const myReservation: Rule = (path) =>
  ROUTES.NOTIFICATION && matchPath({ path: ROUTES.MY_RESERVATION, end: true }, path)
    ? { left: 'back', title: '예약 내역' }
    : undefined;

// 나의 대여 현황
const myLoan: Rule = (path) =>
  ROUTES.NOTIFICATION && matchPath({ path: ROUTES.MY_LOAN, end: true }, path)
    ? { left: 'back', title: '대여 현황' }
    : undefined;

// 나의 모임
const myGroup: Rule = (path) =>
  ROUTES.NOTIFICATION && matchPath({ path: ROUTES.MY_GROUP, end: true }, path)
    ? { left: 'back', title: '나의 모임' }
    : undefined;
// 도서관 등록
const libraryCreateRule: Rule = (path) =>
  ROUTES.LIBRARY_CREATE && matchPath({ path: ROUTES.LIBRARY_CREATE, end: true }, path)
    ? { left: 'back', title: '도서관 등록' }
    : undefined;

// 도서 등록
const bookCreateRule: Rule = (path) =>
  ROUTES.BOOK_CREATE && matchPath({ path: ROUTES.BOOK_CREATE, end: true }, path)
    ? { left: 'back', title: '도서 등록' }
    : undefined;

// 기본
const fallbackRule = (): HeaderProps => ({
  left: 'back',
  title: 'BookLink',
  actions: ['bell'],
  notificationCount: 0,
  safeTop: true,
});

const RULES: ReadonlyArray<Rule> = [
  chatDetailRule,
  chatRule,
  boardRule,
  homeRule,
  libraryRootRule,
  libraryDetailRule,
  settingRule,
  notiRole,
  loginRule,
  signupRule,
  myReservation,
  myLoan,
  myGroup,
  libraryCreateRule,
  bookCreateRule,
];

export function getHeaderForRoute(pathname: string, search: string): HeaderProps {
  for (const rule of RULES) {
    const hit = rule(pathname, search);
    if (hit) return hit;
  }
  return fallbackRule();
}
