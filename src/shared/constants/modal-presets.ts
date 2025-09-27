export type ModalTitleKey = 'LOGOUT' | 'CART_REPLACE' | 'PASSWORD_PROMPT';

export const MODAL_TITLE: Readonly<Record<ModalTitleKey, string>> = {
  LOGOUT: '로그아웃 하시겠습니까?',
  CART_REPLACE: '장바구니에는 같은 도서관의 도서만\n담을 수 있습니다. 기존 도서를 삭제하고\n새로 담을까요?',
  PASSWORD_PROMPT: '인증이 필요합니다.\n비밀번호를 입력해 주세요.',
};
