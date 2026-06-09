<template>
  <div class="notif-detail-page">
    <!-- Page Title -->
    <h2 class="page-title">
      <i class="fa-regular fa-bell"></i>
      تفاصيل الإشعار
    </h2>

    <div v-if="notificationStore.loading" class="flex justify-center p-12">
      <Spinner />
    </div>

    <div v-else-if="notif" class="notif-card">
      <!-- Card Header: sender + time -->
      <div class="notif-card-header">
        <div class="sender-info">
          <div class="sender-icon">
            <i class="fa-solid fa-desktop"></i>
          </div>
          <div>
            <div class="sender-name">نظام إدارة الموافقات البحثية</div>
            <div class="sender-system">إشعار تلقائي</div>
          </div>
        </div>
        <div class="notif-time-badge">
          <i class="fa-regular fa-clock"></i>
          {{ formatDate(notif.created_at) }}
        </div>
      </div>

      <!-- Message Body -->
      <div class="notif-body">
        {{ notif.message }}
      </div>

      <!-- Application Context (if linked) -->
      <div v-if="notif.application" class="app-context">
        <div class="app-context-title">
          <i class="fa-solid fa-file-lines"></i>
          معلومات البحث المرتبط
        </div>
        <div class="app-grid">
          <div class="app-detail-item">
            <span class="app-detail-label">رقم الملف</span>
            <span class="app-detail-val">{{ notif.application.serial_number }}</span>
          </div>
          <div class="app-detail-item">
            <span class="app-detail-label">عنوان البحث</span>
            <span class="app-detail-val">{{ notif.application.title }}</span>
          </div>
          <div class="app-detail-item">
            <span class="app-detail-label">الباحث الرئيسي</span>
            <span v-if="notif.application.is_blinded" class="app-detail-val redacted">
              <i class="fa-solid fa-user-secret"></i> معلومات محجوبة
            </span>
            <span v-else class="app-detail-val">{{ notif.application.principal_investigator }}</span>
          </div>
          <div class="app-detail-item">
            <span class="app-detail-label">تاريخ التقديم</span>
            <span class="app-detail-val">{{ formatDateOnly(notif.application.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <router-link :to="{ name: 'UserNotifications' }" class="btn-secondary">
          <i class="fa-solid fa-arrow-right"></i>
          العودة للإشعارات
        </router-link>
        <router-link
          v-if="notif.application"
          :to="{ name: 'ReviewForm', params: { id: notif.application.id } }"
          class="btn-submit"
        >
          الذهاب لنموذج المراجعة
          <i class="fa-solid fa-microscope"></i>
        </router-link>
      </div>
    </div>

    <!-- Not found -->
    <div v-else class="empty-state">
      <i class="fa-solid fa-bell-slash"></i>
      <p class="font-bold text-lg">الإشعار غير موجود</p>
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
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return dateStr; }
};

const formatDateOnly = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      year: 'numeric', month: '2-digit', day: '2-digit'
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
  gap: 0;
}

.page-title {
  color: oklch(var(--p));
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
}
.page-title i { color: oklch(var(--a)); }

.notif-card {
  background: oklch(var(--b1));
  border: 1px solid oklch(var(--b2));
  border-radius: 14px;
  padding: 30px;
  box-shadow: 0 2px 12px oklch(var(--b3) / 0.6);
  margin-bottom: 25px;
}

.notif-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid oklch(var(--p) / 0.12);
  flex-wrap: wrap;
  gap: 15px;
}

.sender-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sender-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: oklch(var(--a) / 0.1);
  color: oklch(var(--p));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
.sender-name {
  font-weight: 800;
  color: oklch(var(--p));
  font-size: 1.05rem;
}
.sender-system {
  font-size: 0.85rem;
  color: oklch(var(--bc) / 0.5);
  font-weight: 600;
}

.notif-time-badge {
  background: oklch(var(--b2));
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  color: oklch(var(--bc) / 0.55);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.notif-body {
  color: oklch(var(--bc));
  font-size: 1.05rem;
  line-height: 1.75;
  font-weight: 600;
  margin-bottom: 30px;
  white-space: pre-wrap;
}

.app-context {
  background: oklch(var(--a) / 0.04);
  border: 1px solid oklch(var(--a) / 0.15);
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
}
.app-context-title {
  font-weight: 800;
  color: oklch(var(--p));
  margin-bottom: 16px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.app-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
@media (max-width: 600px) { .app-grid { grid-template-columns: 1fr; } }
.app-detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.app-detail-label {
  font-size: 0.8rem;
  color: oklch(var(--bc) / 0.5);
  font-weight: 700;
}
.app-detail-val {
  font-size: 0.95rem;
  color: oklch(var(--bc));
  font-weight: 700;
}
.app-detail-val.redacted {
  color: oklch(var(--er));
  font-style: italic;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid oklch(var(--b2));
  flex-wrap: wrap;
}
.btn-submit {
  background: linear-gradient(135deg, oklch(var(--p)), oklch(var(--a)));
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 25px oklch(var(--a) / 0.3); }
.btn-secondary {
  background: oklch(var(--b2));
  color: oklch(var(--bc));
  border: 1px solid oklch(var(--b3));
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.btn-secondary:hover { background: oklch(var(--b3)); }

.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: oklch(var(--bc) / 0.45);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.empty-state i { font-size: 3rem; opacity: 0.4; }
</style>
