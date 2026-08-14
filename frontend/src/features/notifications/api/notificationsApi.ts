import { MOCK_NOTIFICATIONS } from '../constants/mockData';

export const notificationsApi = {
  getNotifications: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_NOTIFICATIONS;
  },

  markAsRead: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { id };
  },

  markAllAsRead: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  deleteNotification: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { id };
  },
};
