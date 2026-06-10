<template>
  <div class="notif-page" dir="rtl">
    <div class="notif-page-header">
      <h2 class="page-title">
        <i class="fa-solid fa-bell"></i>
        إشعارات النظام
      </h2>
      <p class="page-subtitle">جميع الإشعارات الخاصة بالمهام البحثية المسندة إليك</p>
    </div>

    <div class="notif-header-bar">
      <span class="notif-count">
        <i class="fas fa-bell"></i>
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
        <i class="fas fa-check-double"></i>
        تعيين الكل كمقروء
      </button>
    </div>

    <div
      v-if="notificationStore.loading && !notificationStore.items.length"
      class="flex justify-center p-12"
    >
      <Spinner />
    </div>

    <div v-else-if="!notificationStore.items.length" class="empty-state">
      <i class="fas fa-bell-slash empty-icon"></i>
      <p class="empty-title">لا توجد إشعارات</p>
      <p class="empty-sub">ستظهر هنا أي تنبيهات بشأن الأبحاث المسندة لك.</p>
    </div>

    <div v-else class="notif-list">
      <router-link
        v-for="notif in notificationStore.items"
        :key="notif.id"
        :to="{ name: 'NotificationDetails', params: { id: notif.id } }"
        class="notif-card"
        :class="notif.is_read ? 'read' : 'unread'"
      >
        <div class="notif-icon">
          <i class="fas fa-edit"></i>
        </div>
        <div class="notif-content">
          <div class="notif-msg">{{ notif.message }}</div>
          <div class="notif-meta">
            <span class="notif-time">
              <i class="far fa-clock"></i>
              {{ formatDate(notif.created_at) }}
            </span>
            <span v-if="notif.application" class="notif-app">
              <i class="fas fa-file-lines"></i>
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
      hour: '2-digit', minute: '2-digit',
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
}

.notif-page-header { margin-bottom: 18px; }

.page-title {
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}
.page-title i { color: var(--color-primary); }

.page-subtitle {
  color: color-mix(in oklch, var(--color-base-content) 50%, transparent);
  font-size: 0.88rem;
  font-weight: 500;
}

/* ── header bar ── */
.notif-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 10px;
}

.notif-count {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 999px;
  background: color-mix(in oklch, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.85rem;
}

.notif-badge {
  background: var(--color-primary);
  color: var(--color-primary-content);
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
}

.btn-mark-all {
  background: var(--color-primary);
  color: var(--color-primary-content);
  border: none;
  padding: 9px 18px;
  border-radius: 8px;
  font-family: inherit;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.2s, transform 0.2s;
}
.btn-mark-all:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}

/* ── list ── */
.notif-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* key fix: border-right on unread must use !important
   because the general border shorthand resets all sides */
.notif-card {
  background: var(--color-base-100);
  border: 1px solid var(--color-base-300);
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.18s, box-shadow 0.18s;
  box-shadow: 0 1px 6px color-mix(in oklch, var(--color-base-content) 6%, transparent);
  /* reset individual sides so unread override works cleanly */
  border-top: 1px solid var(--color-base-300);
  border-bottom: 1px solid var(--color-base-300);
  border-left: 1px solid var(--color-base-300);
  border-right: 1px solid var(--color-base-300);
}
.notif-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px color-mix(in oklch, var(--color-base-content) 10%, transparent);
}
.notif-card.unread {
  border-right: 4px solid var(--color-primary) !important;
  background: color-mix(in oklch, var(--color-primary) 4%, var(--color-base-100));
}
.notif-card.read { opacity: 0.72; }

/* ── icon circle ── */
.notif-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-primary-content);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

/* ── text content ── */
.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-msg {
  font-size: 0.92rem;
  color: var(--color-base-content);
  font-weight: 700;
  line-height: 1.5;
  margin-bottom: 6px;
}

.notif-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.notif-time {
  font-size: 0.78rem;
  color: color-mix(in oklch, var(--color-base-content) 50%, transparent);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.notif-app {
  font-size: 0.78rem;
  color: var(--color-primary);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ── unread dot ── */
.notif-unread-dot {
  width: 10px;
  height: 10px;
  min-width: 10px;
  border-radius: 50%;
  background: var(--color-primary);
  flex-shrink: 0;
  animation: dotPulse 2s infinite;
}
@keyframes dotPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

/* ── empty ── */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: color-mix(in oklch, var(--color-base-content) 40%, transparent);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.empty-icon { font-size: 3rem; }
.empty-title { font-weight: 700; font-size: 1.05rem; }
.empty-sub   { font-size: 0.88rem; }
</style>