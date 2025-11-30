import { post } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { mutationKeys } from '@constants/query-keys';
import { mutationOptions } from '@tanstack/react-query';

export interface ILoginParams {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
}

export interface SignupApiRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
  address: string;
  phone: string;
  profileImage?: string;
}

export interface SignupApiResponse {
  data: boolean;
}

export interface ITokenReissueResponse {
  accessToken: string;
}

export const authMutations = {
  POST_LOGIN: () =>
    mutationOptions<ILoginResponse, Error, ILoginParams>({
      mutationKey: mutationKeys.auth.login,
      mutationFn: (data) => post<ILoginResponse>(END_POINT.AUTH_LOGIN, data),
    }),
  POST_LOGOUT: () =>
    mutationOptions<void, Error, void>({
      mutationKey: mutationKeys.auth.logout,
      mutationFn: () => post<void>(END_POINT.AUTH_LOGOUT, {}),
    }),
  POST_SIGNUP: () =>
    mutationOptions<SignupApiResponse, Error, SignupApiRequest>({
      mutationKey: mutationKeys.auth.signup,
      mutationFn: (data) => post<SignupApiResponse>(END_POINT.AUTH_SIGNUP, data),
    }),
  POST_TOKEN_REISSUE: () =>
    mutationOptions<ITokenReissueResponse, Error, void>({
      mutationKey: mutationKeys.auth.reissue,
      mutationFn: () => post<ITokenReissueResponse>(END_POINT.TOKEN_REISSUE, {}),
    }),
};
