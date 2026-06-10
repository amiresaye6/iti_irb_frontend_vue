<template>
  <div class="notif-detail-page" dir="rtl">
    <h2 class="page-title">
      <i class="fa-solid fa-bell"></i>
      تفاصيل الإشعار
    </h2>

    <div v-if="notificationStore.loading" class="flex justify-center p-12">
      <Spinner />
    </div>

    <div v-else-if="notif" class="notif-card">

      <!-- sender row -->
      <div class="card-header">
        <div class="sender-info">
          <div class="sender-icon">
            <i class="fas fa-display"></i>
          </div>
          <div>
            <div class="sender-name">نظام إدارة الموافقات البحثية</div>
            <div class="sender-system">إشعار تلقائي</div>
          </div>
        </div>
        <div class="time-badge">
          <i class="far fa-clock"></i>
          {{ formatDate(notif.created_at) }}
        </div>
      </div>

      <!-- message -->
      <div class="notif-body">{{ notif.message }}</div>

      <!-- linked application -->
      <div v-if="notif.application" class="app-context">
        <div class="app-context-title">
          <i class="fas fa-file-lines"></i>
          معلومات البحث المرتبط
        </div>
        <div class="app-grid">
          <div class="app-item">
            <span class="app-label">رقم الملف</span>
            <span class="app-val">{{ notif.application.serial_number }}</span>
          </div>
          <div class="app-item">
            <span class="app-label">عنوان البحث</span>
            <span class="app-val">{{ notif.application.title }}</span>
          </div>
          <div class="app-item">
            <span class="app-label">الباحث الرئيسي</span>
            <span v-if="notif.application.is_blinded" class="app-val redacted">
              <i class="fas fa-user-secret"></i> معلومات محجوبة
            </span>
            <span v-else class="app-val">{{ notif.application.principal_investigator }}</span>
          </div>
          <div class="app-item">
            <span class="app-label">تاريخ التقديم</span>
            <span class="app-val">{{ formatDateOnly(notif.application.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- actions -->
      <div class="actions">
        <router-link
          v-if="notif.application"
          :to="{ name: 'ReviewForm', params: { id: notif.application.id } }"
          class="btn-primary"
        >
          <i class="fas fa-microscope"></i>
          الذهاب لنموذج المراجعة
        </router-link>
        <router-link :to="{ name: 'UserNotifications' }" class="btn-secondary">
          <i class="fas fa-arrow-left"></i>
          العودة للإشعارات
        </router-link>
      </div>
    </div>

    <!-- not found -->
    <div v-else class="empty-state">
      <i class="fas fa-bell-slash empty-icon"></i>
      <p class="empty-title">الإشعار غير موجود</p>
      <router-link :to="{ name: 'UserNotifications' }" class="btn-secondary mt-4">
        العودة للإشعارات
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNotificationStore } from '@/store/notifications';
import Spinner from '@/components/common/Spinner.vue';

const route = useRoute();
const notificationStore = useNotificationStore();

onMounted(() => {
  notificationStore.fetchNotificationDetails(route.params.id);
});

const notif = computed(() => notificationStore.currentDetails);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleString('ar-SA', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return dateStr; }
};

const formatDateOnly = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    });
  } catch { return dateStr; }
};
</script>

<style scoped>
.notif-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 4px;
  display: flex;
  flex-direction: column;
}

.page-title {
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}
.page-title i { color: var(--color-primary); }

/* ── main card ── */
.notif-card {
  background: var(--color-base-100);
  border: 1px solid var(--color-base-300);
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 2px 12px color-mix(in oklch, var(--color-base-content) 7%, transparent);
}

/* ── card header ── */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 22px;
  border-bottom: 1.5px solid color-mix(in oklch, var(--color-primary) 20%, transparent);
  flex-wrap: wrap;
  gap: 14px;
}

.sender-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sender-icon {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 10px;
  background: color-mix(in oklch, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.sender-name {
  font-weight: 800;
  color: var(--color-primary);
  font-size: 1rem;
}
.sender-system {
  font-size: 0.82rem;
  color: color-mix(in oklch, var(--color-base-content) 50%, transparent);
  font-weight: 600;
  margin-top: 2px;
}

.time-badge {
  background: var(--color-base-200);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.82rem;
  color: color-mix(in oklch, var(--color-base-content) 60%, transparent);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

/* ── message ── */
.notif-body {
  font-size: 1rem;
  color: var(--color-base-content);
  line-height: 1.8;
  font-weight: 600;
  margin-bottom: 24px;
  white-space: pre-wrap;
}

/* ── app context box ── */
.app-context {
  background: color-mix(in oklch, var(--color-primary) 5%, var(--color-base-100));
  border: 1px solid color-mix(in oklch, var(--color-primary) 20%, transparent);
  border-radius: 10px;
  padding: 18px 20px;
  margin-bottom: 24px;
}

.app-context-title {
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 16px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 560px) { .app-grid { grid-template-columns: 1fr; } }

.app-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.app-label {
  font-size: 0.78rem;
  color: color-mix(in oklch, var(--color-base-content) 50%, transparent);
  font-weight: 700;
}
.app-val {
  font-size: 0.92rem;
  color: var(--color-base-content);
  font-weight: 700;
}
.app-val.redacted {
  color: var(--color-error);
  font-style: italic;
}

/* ── actions ── */
.actions {
  display: flex;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--color-base-300);
  flex-wrap: wrap;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-primary-content);
  padding: 11px 22px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.18s, transform 0.18s;
}
.btn-primary:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: var(--color-base-content);
  border: 1.5px solid var(--color-base-300);
  padding: 11px 22px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.18s, border-color 0.18s;
}
.btn-secondary:hover {
  background: var(--color-base-200);
  border-color: var(--color-base-300);
}

/* ── empty ── */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: color-mix(in oklch, var(--color-base-content) 40%, transparent);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.empty-icon { font-size: 3rem; }
.empty-title { font-weight: 700; font-size: 1.05rem; }
</style>