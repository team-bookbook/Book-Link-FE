export const ROUTES = {
  LAYOUT: '/',
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  LIBRARY: '/library',
  BOARD: '/board',
  ONBOARDING: '/onboarding',
  SETTING: '/mypage',
  SETTING_EDIT: '/mypage/edit',
  CHAT: '/chat',
  CHAT_ROOM: (id = ':matchId') => `/chat/${id}`,
};
