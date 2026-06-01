<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <PageHeader 
        title="الإشعارات" 
        subtitle="جميع التنبيهات والإشعارات الخاصة بحسابك"
        icon="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
      <button 
        v-if="notificationStore.unreadCount > 0"
        @click="markAllRead" 
        class="btn btn-outline btn-primary btn-sm"
      >
        تحديد الكل كمقروء
      </button>
    </div>

    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body p-0">
        <div v-if="notificationStore.loading && !notificationStore.items.length" class="flex justify-center p-12">
          <Spinner />
        </div>
        
        <div v-else-if="!notificationStore.items.length" class="text-center p-12 text-base-content/60">
          لا توجد إشعارات حالياً
        </div>

        <ul v-else class="divide-y divide-base-200">
          <li v-for="notif in notificationStore.items" :key="notif.id">
            <router-link 
              :to="{ name: 'NotificationDetails', params: { id: notif.id } }"
              class="block p-4 hover:bg-base-200/50 transition-colors"
              :class="{ 'bg-base-50 font-bold': !notif.is_read }"
            >
              <div class="flex justify-between items-start gap-4">
                <div class="flex-1 flex gap-3">
                  <div class="w-2 h-2 rounded-full mt-2 shrink-0" :class="notif.is_read ? 'bg-transparent' : 'bg-primary'"></div>
                  <div>
                    <h4 class="text-base" :class="notif.is_read ? 'text-base-content/80' : 'text-base-content'">
                      {{ getNotificationTitle(notif) }}
                    </h4>
                    <p class="text-sm mt-1 text-base-content/60 line-clamp-1">{{ notif.message }}</p>
                  </div>
                </div>
                <div class="text-xs text-base-content/50 shrink-0 whitespace-nowrap" dir="ltr">
                  {{ new Date(notif.created_at).toLocaleString('en-GB', { hour12: true }) }}
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useNotificationStore } from '@/store/notifications';
import PageHeader from '@/components/common/PageHeader.vue';
import Spinner from '@/components/common/Spinner.vue';

const notificationStore = useNotificationStore();

onMounted(() => {
  notificationStore.fetchNotifications();
});

const markAllRead = async () => {
  await notificationStore.markAllAsRead();
};

const getNotificationTitle = (notif) => {
  if (notif.application) {
    return `تحديث بخصوص البحث: ${notif.application.serial_number}`;
  }
  return 'إشعار نظام';
};
</script>
