import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notificationsApi';
import { notificationKeys } from '../constants/queryKeys';

export const useNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: notificationsApi.getNotifications,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
      const previous = queryClient.getQueryData(notificationKeys.list());

      queryClient.setQueryData(notificationKeys.list(), (old: any) => {
        if (!old) return old;
        return old.map((n: any) => n.id === id ? { ...n, unread: false } : n);
      });

      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
      const previous = queryClient.getQueryData(notificationKeys.list());

      queryClient.setQueryData(notificationKeys.list(), (old: any) => {
        if (!old) return old;
        return old.map((n: any) => ({ ...n, unread: false }));
      });

      return { previous };
    },
    onError: (err, vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationsApi.deleteNotification(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
      const previous = queryClient.getQueryData(notificationKeys.list());

      queryClient.setQueryData(notificationKeys.list(), (old: any) => {
        if (!old) return old;
        return old.filter((n: any) => n.id !== id);
      });

      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
};
