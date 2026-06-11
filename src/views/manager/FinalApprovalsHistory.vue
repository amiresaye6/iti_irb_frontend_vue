<template>
  <div class="p-6 min-h-screen text-base-content" dir="rtl">
    
    <PageHeader 
      title="سجل الأبحاث المعتمدة نهائياً" 
      note="عرض الأرشيف الكامل لكافة الأبحاث والطلبات التي تم اعتمادها والموافقة عليها من قِبلكم."
    >
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </template>
    </PageHeader>

    <FilterDock 
      :config="[
        { key: 'search', type: 'text', label: 'بحث في الأرشيف', placeholder: 'ابحث برقم البحث أو العنوان...' }
      ]"
      @filter="handleFilter"
    />

    <div v-if="error" class="alert alert-error shadow-lg my-4 max-w-xl mx-auto">
      <div>
        <span>حدث خطأ أثناء تحميل السجل: {{ error.message || error }}</span>
      </div>
    </div>

    <div class="w-full">
      <DataTable 
        :data="filteredApplications" 
        :columns="tableColumns"
        :loading="loading"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :totalItems="totalItems"
        :itemsPerPage="itemsPerPage"
        @page-change="handlePageChange"
      >
        <template #cell(serial_number)="{ item }">
          <span class="font-bold text-success">{{ item.serial_number }}</span>
        </template>

        <template #cell(title)="{ item }">
          <span class="font-medium text-base-content/90">{{ item.title }}</span>
        </template>

        <template #cell(student_name)="{ item }">
          {{ item.student?.full_name || 'N/A' }}
        </template>

        <template #cell(status)="{ item }">
        <div v-if="item.current_stage === 'approved'" class="badge badge-success gap-2 py-3 px-4 font-semibold text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          معتمد نهائياً
        </div>

        <div v-else-if="item.current_stage === 'rejected'" class="badge badge-error gap-2 py-3 px-4 font-semibold text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          مرفوض
        </div>

        <div v-else-if="item.needs_modification === 1 || item.current_stage === 'needs_modification'" class="badge badge-warning gap-2 py-3 px-4 font-semibold text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          يحتاج تعديل
        </div>
        </template>

      
      </DataTable>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import managerService from '@/services/managerService';
import PageHeader from '@/components/common/PageHeader.vue';
import FilterDock from '@/components/common/FilterDock.vue';
import DataTable from '@/components/common/DataTable.vue';
import trackMount from '@/utils/mountTracker';

trackMount('ManagerFinalApprovalsHistory');

const router = useRouter();

const applications = ref([]);
const loading = ref(true);
const error = ref(null);

const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const itemsPerPage = ref(10);
const searchQuery = ref('');

const tableColumns = ref([
  { key: 'serial_number', label: 'رقم البحث', sortable: false },
  { key: 'title', label: 'عنوان البحث', sortable: false },
  { key: 'student_name', label: 'اسم الباحث', sortable: false },
  { key: 'status', label: 'الحالة', sortable: false }
]);

const loadHistoryData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const result = await managerService.getFinalApprovalsHistory();
    
    if (result && result.status === 'success' && Array.isArray(result.data)) {
      applications.value = result.data;
    } else {
      const rawData = result?.data || result?.items || result;
      applications.value = Array.isArray(rawData) ? rawData : [];
    }

    totalItems.value = applications.value.length;
    totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value);
    
  } catch (err) {
    error.value = err;
    console.error('Error in History Dashboard:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadHistoryData();
});

const handleFilter = (filters) => {
  searchQuery.value = filters.search || '';
};

const filteredApplications = computed(() => {
  if (!searchQuery.value) return applications.value;
  const query = searchQuery.value.toLowerCase();
  
  return applications.value.filter(item => {
    const serial = item.serial_number ? String(item.serial_number).toLowerCase() : '';
    const title = item.title ? item.title.toLowerCase() : '';
    const studentName = item.student?.full_name ? item.student.full_name.toLowerCase() : '';
    
    return serial.includes(query) || title.includes(query) || studentName.includes(query);
  });
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

</script>