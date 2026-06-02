<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from '@/components/common/DataTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { applicationServices } from '@/services/applicationServices.js'
import { useAuthStore } from '@/store/auth/auth.store.js'
import { storeToRefs } from 'pinia'


const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const router = useRouter();
const appServices = applicationServices();

const applications = ref([]);
const isLoading = ref(false);
const errorMessage = ref(null);

const setLoading = (val) => isLoading.value = val;
const setError = (err) => errorMessage.value = err?.message || err;

const tableColumns = [
  { key: 'serial_number', label: 'رقم الطلب', sortable: true },
  { key: 'title', label: 'عنوان البحث', sortable: true },
  { key: 'current_stage', label: 'المرحلة الحالية', sortable: true },
  { key: 'actions', label: 'الإجراءات', sortable: false }
];

const fetchApplications = async () => {
    const data = await appServices.getAppsByUserId(setLoading, setError);
    if (data) {
        applications.value = data.reverse();
    }
    
}

onMounted(() => {
    fetchApplications();
    console.log(user);
});

const formatStage = (stage) => {
    const stages = {
        'pending_admin': 'مراجعة اولية',
        'under_review': 'قيد المراجعة',
        'final_review': 'المراجعة النهائية',
        'awaiting_payment': 'في انتظار الدفع',
        'approved': 'مقبول',
        'rejected': 'مرفوض'
    };
    return stages[stage] || stage;
};

const getStageBadgeColor = (stage) => {
    const colors = {
        'pending_admin': 'badge-info',
        'under_review': 'badge-info',
        'final_review': 'badge-info',
        'awaiting_payment': 'badge-warning',
        'approved': 'badge-success',
        'rejected': 'badge-error'
    };
    return colors[stage] || 'badge-neutral';
};

const goToDetails = (appId) => {
    router.push(`/applications/${appId}`)
    console.log("الذهاب لتفاصيل الطلب رقم:", appId);
};

const stageConfig = [
    { key: 'pending_admin',   label: 'مراجعة أولية',      color: '#3b82f6' },
    { key: 'under_review',    label: 'قيد المراجعة',       color: '#6366f1' },
    { key: 'final_review',    label: 'المراجعة النهائية',  color: '#8b5cf6' },
    { key: 'awaiting_payment',label: 'في انتظار الدفع',    color: '#f59e0b' },
    { key: 'approved',        label: 'مقبول',              color: '#10b981' },
    { key: 'rejected',        label: 'مرفوض',              color: '#ef4444' },
];

const countByStage = computed(() => {
    const map = {};
    applications.value.forEach(app => {
        map[app.current_stage] = (map[app.current_stage] || 0) + 1;
    });
    return map;
});

const totalApplications = computed(() => applications.value.length);

const approvedCount = computed(() => countByStage.value['approved'] || 0);

const pendingCount = computed(() =>
    (countByStage.value['pending_admin'] || 0) +
    (countByStage.value['under_review'] || 0) +
    (countByStage.value['final_review'] || 0) +
    (countByStage.value['awaiting_payment'] || 0)
);

const rejectedCount = computed(() => countByStage.value['rejected'] || 0);


const goToNewApplication = () => {
    router.push('/student/new-application');
};
</script>

<template>
    <div>
        <PageHeader :title="user.full_name || 'مستخدم'" :note="` ${user.faculty} \n ${user.department} \n ${user.national_id} \n`" />

        <div class="flex justify-end mb-4">
            <button class="btn btn-primary text-white gap-2" @click="goToNewApplication">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                تقديم بحث جديد
            </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="stat bg-base-100 shadow rounded-xl">
                <div class="stat-figure text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </div>
                <div class="stat-title">إجمالي الطلبات</div>
                <div class="stat-value text-primary">{{ totalApplications }}</div>
                <div class="stat-desc">جميع طلباتك البحثية</div>
            </div>

            <div class="stat bg-base-100 shadow rounded-xl">
                <div class="stat-figure text-success">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="stat-title">مقبول</div>
                <div class="stat-value text-success">{{ approvedCount }}</div>
                <div class="stat-desc">طلبات تمت الموافقة عليها</div>
            </div>

            <div class="stat bg-base-100 shadow rounded-xl">
                <div class="stat-figure text-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="stat-title">طلبات جارية </div>
                <div class="stat-value text-warning">{{ pendingCount }}</div>
                <div class="stat-desc">طلبات تحت المعالجة</div>
            </div>

            <div class="stat bg-base-100 shadow rounded-xl">
                <div class="stat-figure text-error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div class="stat-title">مرفوض</div>
                <div class="stat-value text-error">{{ rejectedCount }}</div>
                <div class="stat-desc">طلبات تم رفضها</div>
            </div>
        </div>

        

        <div v-if="errorMessage" class="alert alert-error shadow-sm mb-4">
            <span>{{ errorMessage }}</span>
            <button class="btn btn-sm" @click="fetchApplications">إعادة المحاولة</button>
        </div>

        <DataTable 
            :data="applications" 
            :columns="tableColumns"
            :loading="isLoading"
        >
            <template #cell(current_stage)="{ item }">
                <div class="badge font-medium p-3" :class="getStageBadgeColor(item.current_stage)">
                    {{ formatStage(item.current_stage) }}
                </div>
            </template>

            <template #cell(actions)="{ item }">
                <button 
                    class="btn btn-sm btn-primary text-white" 
                    @click="goToDetails(item.id)"
                >
                    عرض التفاصيل
                </button>
            </template>

            <template #cell(serial_number)="{ item }">
                <span v-if="item.serial_number" class="font-bold">{{ item.serial_number }}</span>
                <span v-else class="text-gray-400 text-sm">لم يتم التعيين بعد</span>
            </template>
        </DataTable>
    </div>
</template>