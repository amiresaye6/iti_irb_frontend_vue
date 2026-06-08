<template>
  <div class="p-6 min-h-screen text-base-content" dir="rtl">
    
    <PageHeader 
      title="لوحة تحكم المدير " 
      note="متابعة الأبحاث الجاهزة للاعتماد النهائي ."
    >
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      </template>
    </PageHeader>

    <FilterDock 
      :config="[
        { key: 'search', type: 'text', label: 'البحث السريع', placeholder: 'ابحث برقم البحث أو عنوان البحث...' }
      ]"
      @filter="handleFilter"
    />

    <div v-if="error" class="alert alert-error shadow-lg my-4 max-w-xl mx-auto">
      <div>
        <span>حدث خطأ أثناء تحميل أبحاث الداش بورد: {{ error.message || error }}</span>
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
          <span class="font-bold text-primary">{{ item.serial_number }}</span>
        </template>

        <template #cell(title)="{ item }">
          <span class="font-medium text-base-content/90">{{ item.title }}</span>
        </template>

        <template #cell(student_name)="{ item }">
          <span class="text-base-content">{{ item.student?.full_name || 'N/A' }}</span>
        </template>

        <template #cell(status)="{}">
          <div class="badge badge-warning gap-2 py-3 px-4 font-semibold text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            قيد مراجعة المدير
          </div>
        </template>

        <template #cell(actions)="{ item }">
          <div class="flex justify-center w-full">
            <button 
              @click="goToDecision(item.id)" 
              class="btn btn-primary btn-sm text-white font-medium shadow-sm gap-1 transition-all hover:scale-105"
            >
              ⚖️ مراجعة واعتماد
            </button>
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

trackMount('ManagerDashboard');

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
  { key: 'title', label: 'عنوان البحث', sortable: false},
  { key: 'student_name', label: 'اسم الباحث', sortable: false },
  { key: 'status', label: 'الحالة الحالية', sortable: false },
  { key: 'actions', label: 'العمليات', sortable: false, class: 'text-center' }
]);

const loadDashboardData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const result = await managerService.getFinalApprovals(); 
    
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
    console.error('Error in Dashboard:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDashboardData();
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

const goToDecision = (applicationId) => {
  router.push(`/manager/decisions/${applicationId}`);
};
</script>