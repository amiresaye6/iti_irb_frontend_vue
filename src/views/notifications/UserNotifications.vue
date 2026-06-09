<template>
  <div class="notif-page">
    <!-- Page Header -->
    <div class="notif-page-header">
      <h2 class="page-title">
        <i class="fa-solid fa-bell"></i>
        إشعارات النظام
      </h2>
      <p class="page-subtitle">جميع الإشعارات الخاصة بالمهام البحثية المسندة إليك</p>
    </div>

    <!-- Count + Mark All Read -->
    <div class="notif-header-bar">
      <span class="notif-count">
        <i class="fa-solid fa-bell"></i>
        إجمالي: {{ notificationStore.items.length }}
        <span v-if="notificationStore.unreadCount > 0" class="notif-badge">
          {{ notificationStore.unreadCount }} جديد
        </span>
      </span>
      <button
        v-if="notificationStore.unreadCount > 0"
        @click="markAllRead"
        class="btn-mark-all"
      >
        <i class="fa-solid fa-check-double"></i>
        تعيين الكل كمقروء
      </button>
    </div>

    <!-- Loading -->
    <div v-if="notificationStore.loading && !notificationStore.items.length" class="flex justify-center p-12">
      <Spinner />
    </div>

    <!-- Empty State -->
    <div v-else-if="!notificationStore.items.length" class="empty-state">
      <i class="fa-solid fa-bell-slash"></i>
      <p style="font-weight:700;font-size:1.05rem;">لا توجد إشعارات</p>
      <p style="font-size:0.9rem;">ستظهر هنا أي تنبيهات بشأن الأبحاث المسندة لك.</p>
    </div>

    <!-- Notification List -->
    <div v-else class="notif-list">
      <router-link
        v-for="notif in notificationStore.items"
        :key="notif.id"
        :to="{ name: 'NotificationDetails', params: { id: notif.id } }"
        class="notif-card"
        :class="!notif.is_read ? 'unread' : 'read'"
      >
        <div class="notif-icon type-info">
          <i class="fa-solid fa-file-signature"></i>
        </div>
        <div class="notif-body">
          <div class="notif-msg">{{ notif.message }}</div>
          <div class="notif-meta">
            <span class="notif-time">
              <i class="fa-regular fa-clock"></i>
              {{ formatDate(notif.created_at) }}
            </span>
            <span v-if="notif.application" class="notif-app">
              <i class="fa-solid fa-file-lines"></i>
              {{ notif.application.serial_number }}
            </span>
          </div>
        </div>
        <div v-if="!notif.is_read" class="notif-unread-dot"></div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useNotificationStore } from '@/store/notifications';
import Spinner from '@/components/common/Spinner.vue';

const notificationStore = useNotificationStore();

onMounted(() => {
  notificationStore.fetchNotifications();
});

const markAllRead = async () => {
  await notificationStore.markAllAsRead();
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleString('ar-SA', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
};
</script>

<style scoped>
.notif-page {
  max-width: 850px;
  margin: 0 auto;
  padding: 0 4px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.notif-page-header {
  margin-bottom: 18px;
}

.page-title {
  color: oklch(var(--p));
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}
.page-title i { color: oklch(var(--a)); }
.page-subtitle {
  color: oklch(var(--bc) / 0.55);
  font-size: 0.9rem;
  font-weight: 500;
}

.notif-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
}
.notif-count {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 999px;
  background: oklch(var(--p) / 0.1);
  color: oklch(var(--p));
  font-weight: 700;
  font-size: 0.88rem;
}
.notif-badge {
  background: oklch(var(--a));
  color: white;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
}

.btn-mark-all {
  background: linear-gradient(135deg, oklch(var(--p)), oklch(var(--a)));
  color: white;
  border: none;
  padding: 9px 18px;
  border-radius: 8px;
  font-family: inherit;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  text-decoration: none;
}
.btn-mark-all:hover { transform: translateY(-2px); box-shadow: 0 8px 25px oklch(var(--a) / 0.3); }

.notif-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notif-card {
  background: oklch(var(--b1));
  border: 1px solid oklch(var(--b2));
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  gap: 14px;
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
.notif-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px oklch(var(--b3) / 0.8); }
.notif-card.unread {
  border-right: 4px solid oklch(var(--a));
  background: linear-gradient(135deg, oklch(var(--a) / 0.04) 0%, oklch(var(--b1)) 100%);
}
.notif-card.read { opacity: 0.78; }

.notif-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.1rem;
  color: white;
}
.notif-icon.type-info {
  background: linear-gradient(135deg, oklch(var(--p)), oklch(var(--a)));
}

.notif-body { flex: 1; min-width: 0; }
.notif-msg {
  font-size: 0.92rem;
  color: oklch(var(--bc));
  font-weight: 700;
  line-height: 1.5;
  margin-bottom: 6px;
}
.notif-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.notif-time {
  font-size: 0.8rem;
  color: oklch(var(--bc) / 0.55);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}
.notif-app {
  font-size: 0.8rem;
  color: oklch(var(--p));
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}

.notif-unread-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: oklch(var(--a));
  flex-shrink: 0;
  animation: dotPulse 2s infinite;
  align-self: center;
}
@keyframes dotPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: oklch(var(--bc) / 0.45);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.empty-state i { font-size: 3rem; opacity: 0.45; }
</style>
