<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from '@/components/common/DataTable.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import { logServices } from '@/services/logsServices.js'; 

const router = useRouter();
const logsServices = logServices();

const logs = ref([]);
const isLoading = ref(false);
const errorMessage = ref(null);
const userRole = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const itemsPerPage = ref(10);

const filterSerialNumber = ref('');
const filterUserId = ref('');
const filterType = ref('all');

const activeSearch = ref({ type: 'all', value: null });

const columns = ref([
    { key: 'application_id', label: 'رقم الطلب / السيريال', sortable: false },
    { key: 'user_id', label: 'المستخدم', sortable: false },
    { key: 'type', label: 'نوع الحدث', sortable: false },
    { key: 'action', label: 'التفاصيل', sortable: false },
    { key: 'created_at', label: 'التاريخ والوقت', sortable: false }
]);

const setLoading = (val) => isLoading.value = val;
const setError = (err) => errorMessage.value = err?.message || err;

// Search Functions
const searchBySerial = () => {
    if (!filterSerialNumber.value) return;
    activeSearch.value = { type: 'serial', value: String(filterSerialNumber.value).trim() };
    fetchLogs(1);
};

const searchByUserId = () => {
    if (!filterUserId.value) return;
    activeSearch.value = { type: 'user', value: String(filterUserId.value).trim() };
    fetchLogs(1);
};

const searchByType = () => {
    if (!filterType.value) return;
    activeSearch.value = { type: 'type', value: filterType.value };
    fetchLogs(1);
};

const clearFilters = () => {
    filterSerialNumber.value = '';
    filterUserId.value = '';
    filterType.value = 'all';
    activeSearch.value = { type: 'all', value: null };
    fetchLogs(1);
};

const fetchLogs = async (page = 1) => {
    let response = null;
    errorMessage.value = null; 
    
    if (activeSearch.value.type === 'serial') {
        response = await logsServices.getLogsBySerialNumber(activeSearch.value.value, page, setLoading, setError);
    } else if (activeSearch.value.type === 'user') {
        response = await logsServices.getLogsByUserId(activeSearch.value.value, page, setLoading, setError);
    } else if (activeSearch.value.type === 'type' && activeSearch.value.value !== 'all') {
        response = await logsServices.getLogsByType(activeSearch.value.value, page, setLoading, setError);
    } else {
        response = await logsServices.getAllLogs(page, setLoading, setError);
    }

    if (response && response.data) {
        const paginated = response;

        logs.value = paginated.data || [];
        currentPage.value = paginated.current_page || 1;
        totalPages.value = paginated.last_page || 1;
        totalItems.value = paginated.total || 0;
        itemsPerPage.value = paginated.per_page || 10;
    }
};

onMounted(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    userRole.value = user?.role || '';
    fetchLogs(1);
});

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        fetchLogs(page);
    }
};

const formatType = (type) => {
    const types = {
        'submission': 'تقديم جديد',
        'modify_application': 'تعديل',
        'assignment': 'تعيين مراجع',
        'status_change': 'تغيير حالة',
        'certificate': 'شهادة',
        'decision': 'قرار',
        'auth': 'مصادقة',
        'payment': 'دفع'
    };
    return types[type] || type;
};

const getStageBadgeColor = (stage) => {
    const colors = {
        'submission': 'badge-info',
        'modify_application': 'badge-warning',
        'assignment': 'badge-error', 
        'status_change': 'badge-primary',
        'certificate': 'badge-success',
        'decision': 'badge-rose',
        'auth': 'badge-accent',
        'payment': 'badge-secondary'
    };
    return colors[stage] || 'badge-neutral';
};

const formatDate = (dateString) => {
    if (!dateString) return '--';
    try {
        const parts = dateString.split('T');
        const datePart = parts[0]; 
        const timePart = parts[1].split('.')[0]; 

        const [year, month, day] = datePart.split('-');
        let [hours, minutes] = timePart.split(':');

        hours = parseInt(hours, 10);
        const ampm = hours >= 12 ? 'م' : 'ص';
        
        hours = hours % 12;
        hours = hours ? hours : 12; 
        const strHours = String(hours).padStart(2, '0');

        return `${year}-${month}-${day} | ${strHours}:${minutes} ${ampm}`;
    } catch (e) {
        return dateString; 
    }
};
</script>

<template>
    <div class="p-4 space-y-6 flex flex-col min-h-screen">
        <PageHeader title="سجل النشاطات (Logs)" />

        <div class="bg-base-100 p-5 rounded-2xl shadow-sm border border-base-200/60 flex flex-wrap items-end gap-6">
            
            <div class="flex items-end gap-2 w-full sm:w-auto flex-1 max-w-sm">
                <div class="form-control w-full">
                    <label class="label"><span class="label-text font-medium">رقم الطلب (Serial)</span></label>
                    <input 
                        type="text" 
                        v-model="filterSerialNumber" 
                        placeholder="IRB-2026-..." 
                        class="input input-bordered w-full"
                        @keyup.enter="searchBySerial"
                    />
                </div>
                <button @click="searchBySerial" class="btn btn-primary">بحث</button>
            </div>

            <div class="flex items-end gap-2 w-full sm:w-auto flex-1 max-w-sm">
                <div class="form-control w-full">
                    <label class="label"><span class="label-text font-medium">رقم المستخدم (ID)</span></label>
                    <input 
                        type="number" 
                        v-model="filterUserId" 
                        placeholder="مثال: 1" 
                        class="input input-bordered w-full"
                        @keyup.enter="searchByUserId"
                    />
                </div>
                <button @click="searchByUserId" class="btn btn-primary">بحث</button>
            </div>

            <div class="flex items-end gap-2 w-full sm:w-auto flex-1 max-w-sm">
                <div class="form-control w-full">
                    <label class="label"><span class="label-text font-medium">نوع الحدث</span></label>
                    <select v-model="filterType" class="select select-bordered w-full">
                        <option value="all">الكل (All)</option>
                        <option value="submission">تقديم جديد</option>
                        <option value="modify_application">تعديلات</option>
                        <option value="assignment">تعيين مراجع</option>
                        <option value="status_change">تغيير حالة</option>
                        <option value="certificate">شهادة</option>
                        <option value="decision">قرارات</option>
                        <option value="auth">تسجيل الدخول/الخروج</option>
                        <option value="payment">عمليات الدفع</option>
                    </select>
                </div>
                <button @click="searchByType" class="btn btn-primary">بحث</button>
            </div>

            <div class="w-full sm:w-auto mt-2 sm:mt-0">
                <button @click="clearFilters" class="btn btn-outline btn-error w-full sm:w-auto">
                    إلغاء الفلاتر
                </button>
            </div>
        </div>

        <div v-if="errorMessage" class="alert alert-error shadow-sm rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{{ errorMessage }}</span>
        </div>

        <DataTable
            :data="logs"
            :loading="isLoading"
            :columns="columns"
            :currentPage="currentPage"
            :totalPages="totalPages"
            :totalItems="totalItems"
            :itemsPerPage="itemsPerPage"
            @page-change="goToPage"
        >
            <template #cell(type)="{ item }">
                <div class="badge gap-2" :class="getStageBadgeColor(item.type)">
                    {{ formatType(item.type) }}
                </div>
            </template>

            <template #cell(application_id)="{ item }">
                <span v-if="item.application && item.application.serial_number" class="font-bold text-primary">
                    {{ item.application.serial_number }}
                </span>
                <span v-else-if="item.application_id" class="font-bold">
                    #{{ item.application_id }}
                </span>
                <span v-else class="text-base-content/40">--</span>
            </template>

            <!-- <template #cell(user_id)="{ item }">
                <span v-if="item.user && item.user.full_name">
                    {{ item.user.full_name }}
                </span>
                
                <span v-else-if="item.user_id">
                    المستخدم #{{ item.user_id }}
                </span>
                <span v-else class="text-base-content/40 font-bold">النظام</span>
            </template> -->
            <template #cell(user_id)="{ item }">
             <div v-if="userRole === 'super_admin'" class="flex flex-col gap-0.5">
             <span class="font-bold text-base-content">
                {{ item.user?.full_name || 'باحث غير مسجل' }}
             </span>
             <span class="text-xs text-primary font-mono">ID: #{{ item.user_id }}</span>
             </div>

             <div v-else>
              <span v-if="item.user && item.user.full_name">
                {{ item.user.full_name }}
             </span>
             <span v-else-if="item.user_id">
                المستخدم #{{ item.user_id }}
             </span>
             <span v-else class="text-base-content/40 font-bold">النظام</span>
            </div>
            </template>
            <template #cell(created_at)="{ item }">
                <span class="text-sm text-base-content/80 whitespace-nowrap" dir="ltr">
                    {{ formatDate(item.created_at) }}
                </span>
            </template>
        </DataTable>

        

    </div>
</template>