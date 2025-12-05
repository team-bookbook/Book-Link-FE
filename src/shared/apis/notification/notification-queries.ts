import { get } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import { queryKeys } from '@constants/query-keys';
import { queryOptions } from '@tanstack/react-query';

type NotificationType = {
  type: 'RETURN_DUE';
};

export interface INotification {
  id: string;
  userId: string;
  message: string;
  type: NotificationType;
  relatedId: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationQueries = {
  GET_NOTIFICATION: (userId?: string) =>
    queryOptions<INotification[]>({
      queryKey: queryKeys.notification.lists(),
      queryFn: async () => {
        const res = await get<INotification[]>(END_POINT.NOTIFICATION, {
          params: { userId },
        });
        return res;
      },
      enabled: !!userId,
    }),
};
