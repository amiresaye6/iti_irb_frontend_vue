import { defineStore } from 'pinia';
import { notificationService } from '@/services/notificationService';

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    items: [],
    currentDetails: null,
    loading: false,
    error: null
  }),

  getters: {
    unreadCount: (state) => state.items.filter(n => !n.is_read).length
  },

  actions: {
    async fetchNotifications() {
      this.loading = true;
      const data = await notificationService.getNotifications(
        (v) => { this.loading = v; },
        (e) => { this.error = e?.message || null; }
      );
      if (data) this.items = data;
    },

    async fetchNotificationDetails(id) {
      this.loading = true;
      const data = await notificationService.getNotificationDetails(
        id,
        (v) => { this.loading = v; },
        (e) => { this.error = e?.message || null; }
      );
      if (data) {
        this.currentDetails = data;
        // Update local list so unread count refreshes
        const index = this.items.findIndex(n => n.id == id);
        if (index !== -1) {
          this.items[index].is_read = true;
        }
      }
    },

    async markAllAsRead() {
      const data = await notificationService.markAllAsRead();
      if (data) {
        this.items.forEach(n => n.is_read = true);
      }
    }
  }
});

