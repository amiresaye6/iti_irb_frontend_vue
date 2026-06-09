<template>
  <div class="space-y-6 p-4 md:p-6">
    <div class="mb-6">
      <h2 class="text-primary text-2xl font-extrabold flex items-center gap-3 mb-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        سجل المراجعات
      </h2>
      <p class="text-base-content/60 text-sm font-medium">تاريخ الأبحاث التي تم إسنادها لك وقراراتك السابقة</p>
    </div>

    <!-- Search Toolbar -->
    <SearchBar
      v-model="searchQuery"
      title="البحث والتصفية"
      search-label="البحث السريع"
      placeholder="ابحث برقم الملف أو عنوان البحث..."
      input-id="historySearchInput"
      @reset="handleReset"
    >
      <template #extra-filters>
          <div class="irb-filter-group w-full md:w-auto">
            <label class="text-[0.78rem] font-extrabold text-primary flex items-center gap-1.5 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              حالة الإسناد
            </label>
            <select v-model="statusFilter" class="select select-bordered w-full md:w-40 bg-white border-slate-300">
              <option value="">الكل</option>
              <option value="accepted">مقبول</option>
              <option value="refused">مرفوض</option>
              <option value="awaiting_acceptance">بانتظار القبول</option>
            </select>
          </div>

          <div class="irb-filter-group w-full md:w-auto">
            <label class="text-[0.78rem] font-extrabold text-primary flex items-center gap-1.5 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              قرار المراجعة
            </label>
            <select v-model="decisionFilter" class="select select-bordered w-full md:w-40 bg-white border-slate-300">
              <option value="">الكل</option>
              <option value="pending">قيد الانتظار</option>
              <option value="approved">موافقة</option>
              <option value="needs_modification">طلب تعديل</option>
              <option value="rejected">رفض</option>
            </select>
          </div>
      </template>
    </SearchBar>

    <!-- Results Bar -->
    <div class="flex items-center justify-between bg-base-100 p-3 rounded-lg border border-base-200 shadow-sm mt-4">
      <span class="text-base-content font-bold flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        إجمالي: {{ filteredData.length }} سجل
      </span>
    </div>

    <DataTable 
      :data="filteredData" 
      :columns="columns"
      :loading="reviewStore.loading"
      :current-sort-column="sortCol"
      :current-sort-direction="sortDir"
      @sort="handleSort"
      class="mt-4"
    >
      <template #cell(serial_number)="{ item }">
        <span class="text-neutral-content font-extrabold px-3 py-1.5 rounded-md text-sm whitespace-nowrap shadow-sm border border-neutral-content/20" style="background-color: oklch(35% 0.02 245)">
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
          <span class="font-bold text-base-content text-[0.92rem]">{{ new Date(item.assigned_at).toLocaleDateString('ar-SA') }}</span>
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

const statusFilter = ref('');
const decisionFilter = ref('');

const columns = [
  { key: 'serial_number', label: 'رقم الملف', sortable: true },
  { key: 'research_data', label: 'عنوان البحث', sortable: false },
  { key: 'assignment_status', label: 'حالة الإسناد', sortable: true },
  { key: 'decision', label: 'قرار المراجعة', sortable: false },
  { key: 'assigned_at', label: 'تاريخ الإسناد', sortable: true }
];

const sortCol = ref('');
const sortDir = ref('');

const handleSort = ({ column, direction }) => {
  sortCol.value = column;
  sortDir.value = direction;
};

const handleReset = () => {
  searchQuery.value = '';
  statusFilter.value = '';
  decisionFilter.value = '';
};

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
  
  if (statusFilter.value) {
    list = list.filter(a => a.assignment_status === statusFilter.value);
  }
  
  if (decisionFilter.value) {
    list = list.filter(a => a.decision === decisionFilter.value);
  }
  
  if (sortCol.value && sortDir.value) {
    list.sort((a, b) => {
      let valA = a[sortCol.value] || '';
      let valB = b[sortCol.value] || '';
      
      if (valA < valB) return sortDir.value === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir.value === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  return list;
});

onMounted(() => {
  reviewStore.fetchAssignmentHistory();
});
</script>
