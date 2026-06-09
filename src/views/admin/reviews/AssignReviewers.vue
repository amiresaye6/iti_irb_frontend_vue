<template>
  <div class="space-y-6 p-4 md:p-6">
    <PageHeader 
      title="تعيين المراجعين" 
      subtitle="إدارة الأبحاث قيد المراجعة وإسنادها للمراجعين المتاحين"
      icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />

    <!-- Search Toolbar -->
    <SearchBar
      v-model="searchQuery"
      title="البحث والتصفية"
      search-label="البحث السريع"
      placeholder="ابحث برقم الملف أو عنوان البحث أو الباحث..."
      input-id="adminSearchInput"
      @reset="searchQuery = ''"
    />

    <!-- Results Bar -->
    <div class="flex items-center justify-between bg-base-100 p-3 rounded-lg border border-base-200 shadow-sm mt-4">
      <span class="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        {{ filteredData.length }} بحث
      </span>
    </div>

    <!-- Table -->
    <DataTable 
      :data="filteredData" 
      :columns="columns"
      :loading="reviewStore.loading"
      class="mt-4"
    >
      <template #cell(serial_number)="{ item }">
        <span class="bg-neutral text-neutral-content font-extrabold px-3 py-1.5 rounded-md text-sm whitespace-nowrap shadow-sm border border-neutral-content/20">
          {{ item.serial_number || '—' }}
        </span>
      </template>

      <template #cell(research_data)="{ item }">
        <div class="text-base-content font-bold text-[0.97rem] mb-1.5 leading-snug">{{ item.title }}</div>
        <div class="text-sm text-base-content/60 flex items-center gap-1.5 flex-wrap leading-snug">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <strong>الباحث:</strong>
          <span>{{ item.principal_investigator }}</span>
          <template v-if="item.department">
            <span class="text-slate-300">|</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {{ item.department }}
          </template>
        </div>
      </template>

      <template #cell(created_at)="{ item }">
        <div class="flex flex-col gap-1">
          <span class="font-bold text-base-content text-[0.92rem]">{{ formatDate(item.created_at) }}</span>
          <small class="text-base-content/60 text-[0.78rem] flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ formatTime(item.created_at) }}
          </small>
        </div>
      </template>

      <template #cell(assignment_status)="{ item }">
        <span v-if="!item.active_assignment" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#475569] bg-[#f1f5f9] border border-[#e2e8f0]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          لم يتم التعيين
        </span>
        <span v-else-if="item.active_assignment.assignment_status === 'awaiting_acceptance'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#856404] bg-[#fff3cd] border border-[#ffeeba]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          بانتظار: {{ item.active_assignment.full_name || 'المراجع' }}
        </span>
        <span v-else class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#155724] bg-[#d4edda] border border-[#c3e6cb]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          مقبول: {{ item.active_assignment.full_name || 'المراجع' }}
        </span>
      </template>

      <template #row-actions="{ item }">
        <router-link 
          :to="{ name: 'AssignForm', params: { id: item.id } }" 
          class="btn btn-sm btn-primary shrink-0 gap-1.5"
        >
          <svg v-if="item.active_assignment" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          {{ item.active_assignment ? 'متابعة' : 'إسناد' }}
        </router-link>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useReviewStore } from '@/store/reviews/index';
import PageHeader from '@/components/common/PageHeader.vue';
import DataTable from '@/components/common/DataTable.vue';
import SearchBar from '@/components/common/SearchBar.vue';

const reviewStore = useReviewStore();
const searchQuery = ref('');

const columns = [
  { key: 'serial_number', label: 'رقم الملف', sortable: false },
  { key: 'research_data', label: 'بيانات البحث', sortable: false },
  { key: 'created_at', label: 'تاريخ التقديم', sortable: false },
  { key: 'assignment_status', label: 'حالة الإسناد', sortable: false }
];

const filteredData = computed(() => {
  let list = reviewStore.applicationsUnderReview || [];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(a => 
      (a.serial_number && a.serial_number.toLowerCase().includes(q)) ||
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.principal_investigator && a.principal_investigator.toLowerCase().includes(q)) ||
      (a.department && a.department.toLowerCase().includes(q))
    );
  }
  return list;
});

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
};

onMounted(() => {
  reviewStore.fetchApplicationsUnderReview();
  // We no longer need fetchAvailableReviewers here since it's moved to AssignForm
});
</script>
