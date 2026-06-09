<template>
  <div class="space-y-6 p-4 md:p-6">
    <PageHeader 
      title="سجل المراجعات" 
      subtitle="تاريخ الأبحاث التي تم إسنادها لك وقراراتك السابقة"
      icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />

    <!-- Search Toolbar -->
    <SearchBar
      v-model="searchQuery"
      title="البحث والتصفية"
      search-label="البحث السريع"
      placeholder="ابحث برقم الملف أو عنوان البحث..."
      input-id="historySearchInput"
      @reset="searchQuery = ''"
    />

    <!-- Results Bar -->
    <div class="flex items-center justify-between bg-base-100 p-3 rounded-lg border border-base-200 shadow-sm mt-4">
      <span class="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ filteredData.length }} سجل
      </span>
    </div>

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
      </template>

      <template #cell(assignment_status)="{ item }">
        <span v-if="item.assignment_status === 'awaiting_acceptance'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#856404] bg-[#fff3cd] border border-[#ffeeba]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          بانتظار القبول
        </span>
        <span v-else-if="item.assignment_status === 'accepted'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#155724] bg-[#d4edda] border border-[#c3e6cb]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          مقبول
        </span>
        <span v-else-if="item.assignment_status === 'refused'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#721c24] bg-[#f8d7da] border border-[#f5c6cb]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          مرفوض
        </span>
        <span v-else class="badge badge-ghost">{{ item.assignment_status }}</span>
      </template>

      <template #cell(decision)="{ item }">
        <template v-if="item.assignment_status === 'accepted'">
          <span v-if="item.decision === 'pending'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#92400e] bg-[#fef3c7] border border-[#fde68a]">
            قيد الانتظار
          </span>
          <span v-else-if="item.decision === 'needs_modification'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#92400e] bg-[#fff7ed] border border-[#fed7aa]">
            طلب تعديل
          </span>
          <span v-else-if="item.decision === 'approved'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#166534] bg-[#dcfce7] border border-[#bbf7d0]">
            موافقة
          </span>
          <span v-else-if="item.decision === 'rejected'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#991b1b] bg-[#fee2e2] border border-[#fecaca]">
            مرفوض
          </span>
        </template>
        <span v-else-if="item.assignment_status === 'refused'" class="text-sm text-base-content/60 italic border-r-2 border-error pr-2 block w-max">
          سبب الرفض: {{ item.refusal_reason || 'غير محدد' }}
        </span>
        <span v-else class="text-sm text-base-content/50">-</span>
      </template>
      
      <template #cell(assigned_at)="{ item }">
        <div class="flex flex-col gap-1">
          <span class="font-bold text-base-content text-[0.92rem]">{{ new Date(item.assigned_at).toLocaleDateString('en-GB') }}</span>
          <small class="text-base-content/60 text-[0.78rem] flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ new Date(item.assigned_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) }}
          </small>
        </div>
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
  { key: 'research_data', label: 'عنوان البحث', sortable: false },
  { key: 'assignment_status', label: 'حالة الإسناد', sortable: false },
  { key: 'decision', label: 'قرار المراجعة', sortable: false },
  { key: 'assigned_at', label: 'تاريخ الإسناد', sortable: false }
];

const filteredData = computed(() => {
  let list = reviewStore.assignmentHistory || [];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(a => 
      (a.serial_number && a.serial_number.toLowerCase().includes(q)) ||
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.refusal_reason && a.refusal_reason.toLowerCase().includes(q))
    );
  }
  return list;
});

onMounted(() => {
  reviewStore.fetchAssignmentHistory();
});
</script>
