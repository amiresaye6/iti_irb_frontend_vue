<template>
  <div class="space-y-6 p-4 md:p-6">
    <PageHeader 
      title="الأبحاث قيد المراجعة" 
      subtitle="قائمة بالأبحاث التي تم قبول مراجعتها بانتظار قرارك النهائي"
      icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />

    <!-- Search Toolbar -->
    <SearchBar
      v-model="searchQuery"
      title="البحث والتصفية"
      search-label="البحث السريع"
      placeholder="ابحث برقم الملف أو عنوان البحث..."
      input-id="assignedSearchInput"
      @reset="searchQuery = ''"
    >
      <template #extra-filters>
        <div class="irb-filter-group w-full md:w-auto">
          <label class="text-[0.78rem] font-extrabold text-primary flex items-center gap-1.5 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            تصفية حسب القرار
          </label>
          <select v-model="decisionFilter" class="select select-bordered w-full md:w-48 bg-white border-slate-300">
            <option value="">الكل</option>
            <option value="pending">قيد الانتظار</option>
            <option value="needs_modification">طلب تعديل</option>
            <option value="approved">موافقة</option>
            <option value="rejected">مرفوض</option>
          </select>
        </div>
      </template>
    </SearchBar>

    <!-- Results Bar -->
    <div class="flex items-center justify-between bg-base-100 p-3 rounded-lg border border-base-200 shadow-sm mt-4">
      <span class="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
          <template v-if="isRedacted(item)">
            <span class="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md text-xs font-bold italic">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              هوية محجوبة
            </span>
          </template>
          <template v-else>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {{ item.principal_investigator }}
          </template>
        </div>
      </template>

      <template #cell(decision)="{ item }">
        <span v-if="item.decision === 'pending'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#92400e] bg-[#fef3c7] border border-[#fde68a]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          قيد الانتظار
        </span>
        <span v-else-if="item.decision === 'needs_modification'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#92400e] bg-[#fff7ed] border border-[#fed7aa]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          طلب تعديل
        </span>
        <span v-else-if="item.decision === 'approved'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#166534] bg-[#dcfce7] border border-[#bbf7d0]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          موافقة
        </span>
        <span v-else-if="item.decision === 'rejected'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#991b1b] bg-[#fee2e2] border border-[#fecaca]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          مرفوض
        </span>
        <span v-else class="badge badge-ghost">{{ item.decision }}</span>
      </template>

      <template #row-actions="{ item }">
        <router-link 
          :to="{ name: 'ReviewForm', params: { id: item.application_id } }" 
          class="btn btn-sm btn-primary shrink-0 gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          مراجعة
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
const decisionFilter = ref('');

const columns = [
  { key: 'serial_number', label: 'رقم الملف', sortable: false },
  { key: 'research_data', label: 'بيانات البحث', sortable: false },
  { key: 'decision', label: 'القرار الحالي', sortable: false }
];

const isRedacted = (item) => {
  return item.is_blinded || item.principal_investigator === 'معلومات محجوبة';
};

const filteredData = computed(() => {
  let list = reviewStore.activeAssignments || [];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(a => 
      (a.serial_number && a.serial_number.toLowerCase().includes(q)) ||
      (a.title && a.title.toLowerCase().includes(q))
    );
  }
  if (decisionFilter.value) {
    list = list.filter(a => a.decision === decisionFilter.value);
  }
  return list;
});

onMounted(() => {
  reviewStore.fetchActiveAssignments();
});
</script>
