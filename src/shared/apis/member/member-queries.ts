import { get } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { queryKeys } from '@constants/query-keys';
import { queryOptions } from '@tanstack/react-query';

type Provider = 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER';
type UserRole = 'CUSTOMER' | 'ADMIN';
type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

interface IMember {
  id: string;
  email: string;
  name: string;
  nickName: string;
  address: string;
  phone: string;
  provider: Provider;
  role: UserRole;
  status: UserStatus;
  pointBalance: number;
  createdAt: string;
  profileImage: string;
}

export const memberQueries = {
  GET_ME: () =>
    queryOptions<IMember>({
      queryKey: queryKeys.member.me(),
      queryFn: async () => {
        const res = await get<IMember>(END_POINT.MEMBER_ME);
        return res;
      },
    }),
};
