<template>
  <div class="min-h-screen bg-base-200/30 p-4 md:p-8" dir="rtl">
    <div class="max-w-7xl mx-auto">
      
      <!-- 1. Page Header Component -->
      <PageHeader 
        title="طلباتي البحثية الأخيرة" 
        note="نظرة عامة على نشاطك ومتابعة سريعة لأحدث طلبات البحث"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </template>
        
        <template #actions>
          <button class="btn btn-primary shadow-sm hover:shadow-md transition-all rounded-xl gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            تقديم بحث جديد
          </button>
        </template>
      </PageHeader>

      <!-- 2. Filter Dock Component -->
      <FilterDock 
        :config="filterConfig"
        @filter="handleFilterChange"
      />

      <!-- 3. Main Data Table Component -->
      <DataTable 
        :data="tableData" 
        :columns="tableColumns"
        :loading="isLoading"
        :currentPage="queryParams.page"
        :totalPages="Math.ceil(totalItems / queryParams.perPage)"
        :totalItems="totalItems"
        :itemsPerPage="queryParams.perPage"
        :currentSortColumn="queryParams.sortBy"
        :currentSortDirection="queryParams.sortDir"
        @sort="handleSortChange"
        @page-change="handlePageChange"
      >
        <!-- Custom Cell Render for 'status' column -->
        <template #cell(status)="{ item }">
          <div 
            class="badge font-medium gap-1.5 py-3 px-3 shadow-sm"
            :class="{
              'badge-success bg-success/10 text-success border-success/20': item.status === 'معتمد نهائياً',
              'badge-warning bg-warning/10 text-warning-content border-warning/20': item.status === 'مراجعة أولية' || item.status === 'قيد المراجعة',
              'badge-error bg-error/10 text-error border-error/20': item.status === 'مرفوض',
              'badge-info bg-info/10 text-info border-info/20': item.status === 'بانتظار الدفع'
            }"
          >
            <!-- Tiny dot indicator -->
            <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
            {{ item.status }}
          </div>
        </template>

        <!-- Custom Cell Render for 'id' column to look like a badge -->
        <template #cell(id)="{ item }">
          <div class="badge badge-neutral font-mono text-xs rounded-lg py-3">{{ item.id }}</div>
        </template>
      </DataTable>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import FilterDock from '@/components/common/FilterDock.vue'
import DataTable from '@/components/common/DataTable.vue'

// --- 1. State Management for the URL Query representation ---
const queryParams = reactive({
  page: 1,
  perPage: 5,
  sortBy: '',
  sortDir: '',
  filters: {}
})

const isLoading = ref(false)
const totalItems = ref(0)
const tableData = ref([])

// --- 2. Configuration for Filters and Table Columns ---
const filterConfig = [
  { 
    key: 'status', 
    type: 'select', 
    label: 'الحالة', 
    options: [
      {label: 'الكل', value: ''}, 
      {label: 'معتمد نهائياً', value: 'approved'},
      {label: 'بانتظار الدفع', value: 'pending_payment'},
      {label: 'قيد المراجعة', value: 'under_review'}
    ] 
  },
  { 
    key: 'search', 
    type: 'text', 
    label: 'البحث السريع', 
    placeholder: 'ابحث برقم الطلب أو العنوان...' 
  }
]

const tableColumns = [
  { key: 'id', label: 'رقم الطلب', sortable: true, class: 'w-50' },
  { key: 'title', label: 'عنوان البحث', sortable: true },
  { key: 'researcher', label: 'الباحث الرئيسي', sortable: true },
  { key: 'date', label: 'تاريخ التقديم', sortable: true, class: 'w-32' },
  { key: 'status', label: 'المرحلة الحالية', sortable: false, class: 'w-48' }
]

// --- Dummy Data Generator to simulate backend ---
const allDummyData = [
  { id: 'IRB-2026-00020', title: 'بحث جديد عن مرض قديم', researcher: 'أمير السيد عبد السميع', date: '١١ مايو ٢٠٢٦', status: 'معتمد نهائياً' },
  { id: 'IRB-2026-00019', title: 'دراسة تأثير العلاج', researcher: 'محمد أحمد', date: '٨ مايو ٢٠٢٦', status: 'مراجعة أولية' },
  { id: 'IRB-2026-00018', title: 'تأثير التدخل الجراحي المبكر', researcher: 'د. عمر الفاروق', date: '٨ مايو ٢٠٢٦', status: 'بانتظار الدفع' },
  { id: 'IRB-2026-00017', title: 'استخدام الذكاء الاصطناعي في التشخيص', researcher: 'د. عمر الفاروق', date: '٨ مايو ٢٠٢٦', status: 'بانتظار الدفع' },
  { id: 'IRB-2026-00016', title: 'تجربة سريرية جديدة', researcher: 'سارة محمد', date: '٨ مايو ٢٠٢٦', status: 'بانتظار الدفع' },
  { id: 'IRB-2026-00014', title: 'مقارنة تأثير التدخل الجراحي المبكر والتأخير', researcher: 'د. عمر الفاروق', date: '٢٢ أبريل ٢٠٢٦', status: 'قيد المراجعة' },
  { id: 'IRB-2026-00005', title: 'استخدام الذكاء الاصطناعي لاعتلال الشبكية', researcher: 'د. عمر الفاروق', date: '٢٠ أبريل ٢٠٢٦', status: 'بانتظار الدفع' },
  { id: 'IRB-2026-00001', title: 'تأثير الأدوية الحديثة على مرضى السكري', researcher: 'د. عمر الفاروق', date: '١ مارس ٢٠٢٦', status: 'معتمد نهائياً' },
]

// --- 3. Mock API Call Function ---
const fetchBackendData = () => {
  isLoading.value = true
  
  // Simulate network delay
  setTimeout(() => {
    let filteredData = [...allDummyData]
    
    // Apply dummy filters (simulate backend WHERE clauses)
    if (queryParams.filters.search) {
      const s = queryParams.filters.search.toLowerCase()
      filteredData = filteredData.filter(item => 
        item.title.toLowerCase().includes(s) || item.id.toLowerCase().includes(s)
      )
    }
    
    if (queryParams.filters.status) {
      // Map back our dummy values
      const statusMap = {
        'approved': 'معتمد نهائياً',
        'pending_payment': 'بانتظار الدفع',
        'under_review': 'قيد المراجعة'
      }
      filteredData = filteredData.filter(item => item.status === statusMap[queryParams.filters.status] || item.status === 'مراجعة أولية')
    }

    // Apply dummy sorting (simulate backend ORDER BY)
    if (queryParams.sortBy) {
      filteredData.sort((a, b) => {
        const valA = a[queryParams.sortBy]
        const valB = b[queryParams.sortBy]
        if (valA < valB) return queryParams.sortDir === 'asc' ? -1 : 1
        if (valA > valB) return queryParams.sortDir === 'asc' ? 1 : -1
        return 0
      })
    }

    totalItems.value = filteredData.length

    // Apply dummy pagination (simulate backend LIMIT & OFFSET)
    const start = (queryParams.page - 1) * queryParams.perPage
    const end = start + queryParams.perPage
    tableData.value = filteredData.slice(start, end)
    
    isLoading.value = false
  }, 600)
}

// --- 4. Event Handlers emitted by our components ---

const handleFilterChange = (newFilters) => {
  console.log('Filters changed, building query...', newFilters)
  queryParams.filters = newFilters
  queryParams.page = 1 // Reset to first page on filter change
  fetchBackendData()
}

const handleSortChange = ({ column, direction }) => {
  console.log('Sort changed, building query...', { column, direction })
  queryParams.sortBy = column
  queryParams.sortDir = direction
  // Depending on requirements, sorting might reset to page 1 or stay on current page
  fetchBackendData()
}

const handlePageChange = (newPage) => {
  console.log('Page changed, building query...', newPage)
  queryParams.page = newPage
  fetchBackendData()
}

onMounted(() => {
  fetchBackendData()
})
</script>
