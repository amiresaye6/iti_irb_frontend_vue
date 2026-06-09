<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth/auth.store';
import PageHeader   from '@/components/common/PageHeader.vue';
import Spinner      from '@/components/common/Spinner.vue';
import DoughnutChart from '@/components/charts/DoughnutChart.vue';
import BarChart      from '@/components/charts/BarChart.vue';
import { getDashboardStats, getRecentLogs, getRecentApplications } from '@/services/authService';

const authStore = useAuthStore();

const stats       = ref(null);
const recentLogs  = ref([]);
const recentApps  = ref([]);
const isLoading   = ref(false);
const errorMsg    = ref(null);

const setLoading = (v)   => (isLoading.value = v);
const setError   = (err) => (errorMsg.value = err ? (err.message || err) : null);

// متناسقة تماماً مع الـ Badge Classes بتاعة DaisyUI
const STAGE_CONFIG = {
    pending_admin:        { label: 'انتظار مراجعة الأدمن', color: 'badge-warning', barColor: 'bg-warning' },
    under_review:         { label: 'تحت المراجعة',         color: 'badge-info',    barColor: 'bg-info' },
    approved_by_reviewer: { label: 'مقبول من المراجع',   color: 'badge-primary', barColor: 'bg-primary' },
    final_review:         { label: 'المراجعة النهائية',      color: 'badge-accent',  barColor: 'bg-accent' },
    awaiting_payment:     { label: 'انتظار الدفع',           color: 'badge-secondary', barColor: 'bg-secondary' },
    approved:             { label: 'معتمد',                  color: 'badge-success', barColor: 'bg-success' },
    rejected:             { label: 'مرفوض',                 color: 'badge-error',   barColor: 'bg-error' },
};

const LOG_TYPE_CONFIG = {
    submission:          { label: 'تقديم',        color: 'text-primary',   bg: 'bg-primary/10'   },
    assignment:          { label: 'تعيين',        color: 'text-info',      bg: 'bg-info/10'      },
    status_change:       { label: 'تغيير حالة',   color: 'text-warning',   bg: 'bg-warning/10'   },
    certificate:         { label: 'شهادة',        color: 'text-success',   bg: 'bg-success/10'   },
    decision:            { label: 'قرار',         color: 'text-accent',    bg: 'bg-accent/10'    },
    auth:                { label: 'دخول',         color: 'text-neutral',   bg: 'bg-neutral/10'   },
    payment:             { label: 'دفع',          color: 'text-secondary', bg: 'bg-secondary/10' },
    modify_application:  { label: 'تعديل',        color: 'text-error',     bg: 'bg-error/10'     },
    other:               { label: 'أخرى',         color: 'text-base-content/50', bg: 'bg-base-200' },
};

const fetchAll = async () => {
    isLoading.value = true;
    const [statsRes, logsRes, appsRes] = await Promise.all([
        getDashboardStats({ setLoading: () => {}, setError }),
        getRecentLogs({ setLoading: () => {}, setError }),
        getRecentApplications({ setLoading: () => {}, setError }),
    ]);
    if (statsRes) stats.value      = statsRes;
    if (logsRes)  recentLogs.value = logsRes.data ?? logsRes ?? [];
    if (appsRes)  recentApps.value = appsRes.data ?? appsRes ?? [];
    isLoading.value = false;
};

onMounted(fetchAll);

const statCards = computed(() => {
    if (!stats.value) return [];

    const isAdmin   = authStore.isAdmin;
    const isManager = authStore.isManager;

    if (isAdmin) return [
        {
            label: 'إجمالي الطلبات',
            value: stats.value.total_applications ?? 0,
            icon:  'applications',
            color: 'bg-primary/10 text-primary',
        },
        {
            label: 'طلبات التفعيل المعلّقة',
            value: stats.value.pending_users ?? 0,
            icon:  'users',
            color: 'bg-warning/10 text-warning',
        },
        {
            label: 'انتظار مراجعة الأدمن',
            value: stats.value.pending_admin ?? 0,
            icon:  'pending',
            color: 'bg-info/10 text-info',
        },
        {
            label: 'معتمدة هذا الشهر',
            value: stats.value.approved_this_month ?? 0,
            icon:  'approved',
            color: 'bg-success/10 text-success',
        },
    ];

    if (isManager) return [
        {
            label: 'إجمالي الطلبات',
            value: stats.value.total_applications ?? 0,
            icon:  'applications',
            color: 'bg-primary/10 text-primary',
        },
        {
            label: 'في المراجعة النهائية',
            value: stats.value.final_review ?? 0,
            icon:  'review',
            color: 'bg-accent/10 text-accent',
        },
        {
            label: 'معتمدة',
            value: stats.value.approved ?? 0,
            icon:  'approved',
            color: 'bg-success/10 text-success',
        },
        {
            label: 'مرفوضة',
            value: stats.value.rejected ?? 0,
            icon:  'rejected',
            color: 'bg-error/10 text-error',
        },
    ];

    return [];
});

// مصفوفة مساعدة لحساب النسب
const stageBreakdown = computed(() => {
    if (!stats.value?.by_stage) return [];
    return Object.entries(stats.value.by_stage).map(([key, count]) => ({
        key,
        count,
        ...STAGE_CONFIG[key],
        percent: stats.value.total_applications
            ? Math.round((count / stats.value.total_applications) * 100)
            : 0,
    }));
});

// داتا الشارتس مهيأة بالملي بألوان الـ OKLCH الخاصة بـ app.css بعد تحويلها لـ Hex مريح
const chartDataFormatted = computed(() => {
    if (!stats.value?.by_stage) return { labels: [], datasets: [] };

    const labels = stageBreakdown.value.map(s => s.label);
    const data = stageBreakdown.value.map(s => s.count);
    
    // درجات الألوان مأخوذة من الـ app.css لضمان التناسق البصري
    const colors = [
        '#e1cb72', // pending_admin -> Warning هادي
        '#8cbce8', // under_review -> Info سماوي مريح
        '#4da785', // approved_by_reviewer -> Primary المينت جرين بتاعكم
        '#abc9cb', // final_review -> Accent هادي
        '#8edda3', // approved -> Success أخضر فاتح
        '#cd6b6b'  // rejected -> Error أحمر ناعم
    ];

    return {
        labels,
        datasets: [
            {
                label: 'عدد الطلبات',
                backgroundColor: colors,
                borderColor: 'transparent',
                borderWidth: 0,
                hoverOffset: 6,
                data: data,
            }
        ]
    };
});

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ar-EG', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
};
</script>

<template>
    <div class="p-4 md:p-6 space-y-6">

        <PageHeader
            :title="`مرحباً، ${authStore.user?.full_name ?? 'بالنظام'}`"
            :note="authStore.isAdmin ? 'لوحة تحكم مسؤول النظام' : 'لوحة تحكم مدير IRB'"
        >
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </template>
            <template #actions>
                <button class="btn btn-sm btn-ghost btn-circle"
                    :disabled="isLoading" @click="fetchAll">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </template>
        </PageHeader>

        <div v-if="isLoading" class="flex justify-center py-20">
            <Spinner />
        </div>

        <template v-else>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="card in statCards" :key="card.label"
                    class="bg-base-100 rounded-2xl p-5 border border-base-200/60 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            :class="card.color">

                            <svg v-if="card.icon === 'applications'" xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <svg v-else-if="card.icon === 'users'" xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <svg v-else-if="card.icon === 'pending'" xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <svg v-else-if="card.icon === 'approved'" xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <svg v-else-if="card.icon === 'review'" xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <p class="text-3xl font-black text-base-content">{{ card.value }}</p>
                        <p class="text-xs text-base-content/50 mt-0.5 font-medium">{{ card.label }}</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div class="lg:col-span-2 space-y-6">
                    
                    <div class="bg-base-100 rounded-2xl border border-base-200/60 shadow-sm p-6">
                        <h2 class="text-sm font-bold text-base-content mb-4 flex items-center gap-2">
                            <span class="w-1.5 h-3 bg-primary rounded-full"></span>
                            مقارنة أعداد الطلبات في المراحل الحالية
                        </h2>
                        <div class="h-64">
                            <BarChart :chart-data="chartDataFormatted" />
                        </div>
                    </div>

                    <div class="bg-base-100 rounded-2xl border border-base-200/60 shadow-sm overflow-hidden">
                        <div class="px-6 py-4 border-b border-base-200/60 flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 class="text-sm font-bold text-base-content">أحدث الطلبات المستلمة</h2>
                        </div>
                        <div class="divide-y divide-base-200/60">
                            <div v-if="recentApps.length === 0" class="text-center py-8 text-base-content/30 text-sm">لا توجد طلبات حتي الآن</div>
                            <div v-for="app in recentApps.slice(0, 5)" :key="app.id" class="px-6 py-4 hover:bg-base-200/30 transition-colors">
                                <div class="flex items-start justify-between gap-3">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-semibold text-base-content truncate">{{ app.title }}</p>
                                        <p class="text-xs text-base-content/40 mt-0.5">{{ app.serial_number }} · {{ app.principal_investigator }}</p>
                                    </div>
                                    <div class="flex flex-col items-end gap-1 shrink-0">
                                        <span class="badge badge-xs font-medium" :class="STAGE_CONFIG[app.current_stage]?.color ?? 'badge-ghost'">
                                            {{ STAGE_CONFIG[app.current_stage]?.label ?? app.current_stage }}
                                        </span>
                                        <span class="text-[10px] text-base-content/30">{{ formatDate(app.created_at) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-1">
                    <div class="bg-base-100 rounded-2xl border border-base-200/60 shadow-sm p-6 h-full flex flex-col">
                        <h2 class="text-sm font-bold text-base-content mb-6 flex items-center gap-2">
                            <span class="w-1.5 h-3 bg-secondary rounded-full"></span>
                            النسبة المئوية لتوزيع المراحل
                        </h2>
                        <div class="flex-1 flex items-center justify-center min-h-[300px] lg:min-h-0">
                            <DoughnutChart :chart-data="chartDataFormatted" />
                        </div>
                    </div>
                </div>

            </div>

            <div class="bg-base-100 rounded-2xl border border-base-200/60 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-base-200/60 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </div>
                    <h2 class="text-sm font-bold text-base-content">سجل النشاط الأخير للنظام</h2>
                </div>
                <div class="divide-y divide-base-200/60">
                    <div v-if="recentLogs.length === 0" class="text-center py-8 text-base-content/30 text-sm">لا توجد سجلات</div>
                    <div v-for="log in recentLogs.slice(0, 8)" :key="log.id"
                        class="px-6 py-3 flex items-center gap-4 hover:bg-base-200/30 transition-colors">
                        
                        <span class="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0"
                            :class="[
                                LOG_TYPE_CONFIG[log.type]?.color ?? 'text-base-content/50',
                                LOG_TYPE_CONFIG[log.type]?.bg    ?? 'bg-base-200'
                            ]">
                            {{ LOG_TYPE_CONFIG[log.type]?.label ?? log.type }}
                        </span>
                        
                        <p class="text-sm text-base-content/70 flex-1 truncate">
                            {{ log.action }}
                        </p>
                        
                        <span v-if="log.application?.serial_number"
                            class="text-xs text-base-content/30 shrink-0 hidden sm:block">
                            {{ log.application.serial_number }}
                        </span>
                        
                        <span class="text-xs text-base-content/30 shrink-0">
                            {{ formatDate(log.created_at) }}
                        </span>
                    </div>
                </div>
            </div>

        </template>
    </div>
</template>