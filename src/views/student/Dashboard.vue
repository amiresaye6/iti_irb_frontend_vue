<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from '@/components/common/DataTable.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { applicationServices } from '@/services/applicationServices.js'

const user_id = localStorage.getItem('user_id');
const username = localStorage.getItem('username');

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
</script>

<template>
    <div>
        <PageHeader :title="username || 'مستخدم'" note="هذه هي الطلبات البحثية الأخيرة التي قدمتها"/>
        
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