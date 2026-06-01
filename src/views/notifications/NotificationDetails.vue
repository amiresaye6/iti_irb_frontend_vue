<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <router-link :to="{ name: 'UserNotifications' }" class="btn btn-circle btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      </router-link>
      <PageHeader 
        title="تفاصيل الإشعار" 
        subtitle="عرض محتوى الإشعار والتفاصيل المتعلقة به"
      />
    </div>

    <div v-if="notificationStore.loading" class="flex justify-center p-12">
      <Spinner />
    </div>

    <div v-else-if="notif" class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body">
        <div class="border-b border-base-200 pb-4 mb-4 flex justify-between items-start">
          <div>
            <h2 class="text-xl font-bold mb-1">
              {{ notif.application ? `بحث رقم: ${notif.application.serial_number}` : 'إشعار نظام' }}
            </h2>
            <p class="text-sm text-base-content/60" dir="ltr">
              {{ new Date(notif.created_at).toLocaleString('en-GB') }}
            </p>
          </div>
          <div v-if="notif.application" class="badge badge-neutral">
            {{ notif.application.current_stage }}
          </div>
        </div>

        <div class="bg-base-200/50 p-6 rounded-xl text-base-content leading-relaxed text-lg">
          {{ notif.message }}
        </div>

        <div class="mt-6 pt-6 border-t border-base-200" v-if="notif.application">
          <h3 class="font-bold mb-2">تفاصيل البحث المرتبط</h3>
          <p class="text-sm"><span class="font-semibold">العنوان:</span> {{ notif.application.title }}</p>
          <p class="text-sm mt-1"><span class="font-semibold">الباحث الرئيسي:</span> {{ notif.application.principal_investigator }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNotificationStore } from '@/store/notifications';
import PageHeader from '@/components/common/PageHeader.vue';
import Spinner from '@/components/common/Spinner.vue';

const route = useRoute();
const notificationStore = useNotificationStore();

onMounted(() => {
  notificationStore.fetchNotificationDetails(route.params.id);
});

const notif = computed(() => notificationStore.currentDetails);
</script>
