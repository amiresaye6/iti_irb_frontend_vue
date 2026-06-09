<template>
  <div class="space-y-8 p-4 md:p-6">
    <PageHeader 
      title="لوحة تحكم المراجع" 
      subtitle="نظرة عامة على الإحصائيات والأبحاث المسندة"
      icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />

    <div v-if="reviewStore.loading" class="flex justify-center p-12">
      <Spinner />
    </div>

    <template v-else-if="reviewStore.dashboardData">
      <!-- KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="إجمالي المسندة" 
          :value="reviewStore.dashboardData.kpis.totalAssigned" 
          description="جميع الأبحاث"
          color="primary"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </template>
        </KpiCard>
        <KpiCard 
          title="بانتظار القبول" 
          :value="reviewStore.dashboardData.kpis.awaitingAcceptance" 
          description="أبحاث بانتظار موافقتك على مراجعتها"
          color="warning"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </template>
        </KpiCard>
        <KpiCard 
          title="قيد المراجعة" 
          :value="reviewStore.dashboardData.kpis.pendingAction" 
          description="الأبحاث التي تقوم بمراجعتها حاليًا"
          color="info"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </template>
        </KpiCard>
        <KpiCard 
          title="طلب تعديل" 
          :value="reviewStore.dashboardData.kpis.needsModification" 
          description="أبحاث قمت بطلب تعديلات عليها"
          color="secondary"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </template>
        </KpiCard>
        <KpiCard 
          title="مكتملة" 
          :value="reviewStore.dashboardData.kpis.completed" 
          description="الأبحاث التي أكملت مراجعتها"
          color="success"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </template>
        </KpiCard>
      </div>

    
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow-lg border border-base-200">
          <div class="card-body">
            <h2 class="card-title text-xl mb-4">توزيع قرارات المراجعة</h2>
            <div class="h-64 flex items-center justify-center">
              <DoughnutChart v-if="doughnutChartData.labels.length" :chart-data="doughnutChartData" />
              <p v-else class="text-base-content/50">لا توجد بيانات كافية.</p>
            </div>
          </div>
        </div>
        <div class="card bg-base-100 shadow-lg border border-base-200">
          <div class="card-body">
            <h2 class="card-title text-xl mb-4">المراجعات المكتملة (آخر 6 أشهر)</h2>
            <div class="h-64 flex items-center justify-center">
              <BarChart v-if="barChartData.labels.length" :chart-data="barChartData" />
              <p v-else class="text-base-content/50">لا توجد مراجعات مكتملة.</p>
            </div>
          </div>
        </div>
      </div>

   
      <div class="irb-data-card">
        <div class="irb-panel-title">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          أبحاث تتطلب إجراءً منك
        </div>

      
        <div v-if="!reviewStore.awaitingDecisionAssignments || reviewStore.awaitingDecisionAssignments.length === 0" class="irb-empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" class="irb-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="irb-empty-title">عمل رائع!</p>
          <p>لا توجد أبحاث حالياً تتطلب مراجعتك.</p>
        </div>

      
        <DataTable 
          v-else
          :data="reviewStore.awaitingDecisionAssignments"
          :columns="[
            { key: 'serial_number', label: 'رقم الملف', sortable: false },
            { key: 'research_data', label: 'بيانات البحث', sortable: false },
            { key: 'created_at', label: 'تاريخ التقديم', sortable: false },
            { key: 'decision', label: 'حالة المراجعة', sortable: false }
          ]"
        >
          <template #cell(serial_number)="{ item }">
            <span class="bg-neutral text-neutral-content font-extrabold px-3 py-1.5 rounded-md text-sm whitespace-nowrap shadow-sm border border-neutral-content/20">
              {{ item.serial_number || '—' }}
            </span>
          </template>

          <template #cell(research_data)="{ item }">
            <div class="text-base-content font-bold text-[0.97rem] mb-1.5 leading-snug">{{ item.title }}</div>
            <div class="text-sm text-base-content/60 flex items-center gap-1.5 flex-wrap leading-snug" :class="{ 'text-slate-500 italic': isRedacted(item) }">
              <svg v-if="isRedacted(item)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <strong>الباحث:</strong>
              <span>{{ getInvestigator(item) }}</span>
              <span v-if="getDepartment(item)" class="text-primary font-bold whitespace-nowrap">| القسم: {{ getDepartment(item) }}</span>
            </div>
          </template>

          <template #cell(created_at)="{ item }">
            <div class="flex flex-col gap-1">
              <span class="font-bold text-base-content text-[0.92rem]">{{ formatDate(item.assigned_at || item.application?.created_at) }}</span>
              <small class="text-base-content/60 text-[0.78rem] flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatTime(item.assigned_at || item.application?.created_at) }}
              </small>
            </div>
          </template>

          <template #cell(decision)="{ item }">
            <span v-if="item.decision === 'pending'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#92400e] bg-[#fef3c7] border border-[#fde68a]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              قيد المراجعة
            </span>
            <span v-else-if="item.decision === 'needs_modification'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#92400e] bg-[#fff7ed] border border-[#fed7aa]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              يحتاج تعديل
            </span>
            <span v-else class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap text-[#92400e] bg-[#fef3c7] border border-[#fde68a]">
              {{ item.decision || 'قيد المراجعة' }}
            </span>
          </template>

          <template #row-actions="{ item } ">
            <router-link :to="`/reviewer/review/${item.application_id}`" class="btn btn-sm shrink-0 px-6 whitespace-nowrap btn-primary gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              عرض ومراجعة
            </router-link>
          </template>
        </DataTable>
      </div>
    </template>
    
    <div v-else-if="reviewStore.error" class="alert alert-error shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ reviewStore.error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useReviewStore } from '@/store/reviews/index';
import PageHeader from '@/components/common/PageHeader.vue';
import Spinner from '@/components/common/Spinner.vue';
import KpiCard from '@/components/common/KpiCard.vue';
import DoughnutChart from '@/components/charts/DoughnutChart.vue';
import BarChart from '@/components/charts/BarChart.vue';
import DataTable from '@/components/common/DataTable.vue';

const reviewStore = useReviewStore();

// ── Helpers ──────────────────────────────────────────────────────────────────

// The API returns flat fields from formatAssignments() in ReviewService
const isRedacted = (item) => {
  return item.is_blinded || item.principal_investigator === 'معلومات محجوبة';
};

const getInvestigator = (item) => {
  return item.principal_investigator || '—';
};

const getDepartment = (item) => {
  return item.department || '';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
};

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(() => {
  reviewStore.fetchDashboardKPIs();
  reviewStore.fetchAwaitingDecisionAssignments();
});

// ── Charts ────────────────────────────────────────────────────────────────────

const doughnutChartData = computed(() => {
  // Override colors to use standard theme colors if requested, or keep from API
  // By default, the API gives: #3498db (blue), #27ae60 (green), #f39c12 (orange), #e74c3c (red)
  // Let's replace the blue with our primary teal (#10b981) for better theme matching
  let colors = reviewStore.dashboardData?.distribution.colors || [];
  if (colors.length && colors[0] === '#3498db') {
    colors = ['#10b981', ...colors.slice(1)];
  }
  
  return {
    labels: reviewStore.dashboardData?.distribution.labels || [],
    datasets: [{
      backgroundColor: colors,
      data: reviewStore.dashboardData?.distribution.data || [],
    }]
  };
});

const barChartData = computed(() => ({
  labels: reviewStore.dashboardData?.monthly.labels || [],
  datasets: [{
    label: 'المراجعات المكتملة',
    backgroundColor: '#10b981', // Changed from blue to primary teal
    data: reviewStore.dashboardData?.monthly.data || [],
  }]
}));
</script>

<style scoped>
/* ─── Data Card ─────────────────────────────────────────────────────────── */
.irb-data-card {
  background: var(--b1, #fff);
  padding: 25px;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  border: 1px solid oklch(var(--b3, 89.824% 0.00952 262.71));
  margin-top: 8px;
}

.irb-panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.1rem;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 2px solid oklch(var(--p) / 0.15);
}

</style>
