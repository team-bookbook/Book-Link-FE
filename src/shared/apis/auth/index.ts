import * as mockApi from './mock';

// 구현 선택 (트리셰이킹은 빌드 설정에 따라 달라질 수 있음)
const api = mockApi;

// 선택된 구현을 재export (동일한 시그니처 유지)
export const checkNickname = api.checkNickname;
export const sendEmailCode = api.sendEmailCode;
export const verifyEmailCode = api.verifyEmailCode;
export const submitSignup = api.submitSignup;
