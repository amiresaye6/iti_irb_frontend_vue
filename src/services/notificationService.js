import { useApi } from '@/utils/useApi';

const Base_url = import.meta.env.VITE_BACKEND_SERVER;

export const notificationService = {
  getNotifications(setLoading, setError) {
    return useApi({ url: `${Base_url}/notifications`, method: 'GET', setLoading, setError });
  },

  getNotificationDetails(id, setLoading, setError) {
    return useApi({ url: `${Base_url}/notifications/${id}`, method: 'GET', setLoading, setError });
  },

  markAllAsRead(setLoading, setError) {
    return useApi({ url: `${Base_url}/notifications/mark-all-read`, method: 'POST', setLoading, setError });
  }
};
