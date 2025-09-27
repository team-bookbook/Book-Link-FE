export type ToastMessageKey = 'EMAIL_CHECK' | 'LOGIN_SUCCESS' | 'LOGIN_FAIL';

export const TOAST_MESSAGE: Readonly<Record<ToastMessageKey, string>> = {
  EMAIL_CHECK: '이메일을 확인해 주세요.',
  LOGIN_SUCCESS: '로그인에 성공했습니다.',
  LOGIN_FAIL: '로그인에 실패했습니다.',
};
