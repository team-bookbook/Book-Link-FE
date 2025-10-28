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
  refreshToken: string;
}

export const authMutations = {
  POST_LOGIN: () =>
    mutationOptions<ILoginResponse, Error, ILoginParams>({
      mutationKey: mutationKeys.auth.login,
      mutationFn: (data) => post<ILoginResponse>(END_POINT.AUTH_LOGIN, data),
    }),
};
