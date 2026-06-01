<template>
  <div class="space-y-6">
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div class="card bg-base-100 shadow-sm border border-base-200">
          <div class="card-body p-6 text-center">
            <h3 class="text-lg font-semibold text-base-content/70 mb-2">إجمالي المسندة</h3>
            <p class="text-4xl font-bold text-primary">{{ reviewStore.dashboardData.kpis.totalAssigned }}</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-sm border border-base-200">
          <div class="card-body p-6 text-center">
            <h3 class="text-lg font-semibold text-base-content/70 mb-2">بانتظار القبول</h3>
            <p class="text-4xl font-bold text-warning">{{ reviewStore.dashboardData.kpis.awaitingAcceptance }}</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-sm border border-base-200">
          <div class="card-body p-6 text-center">
            <h3 class="text-lg font-semibold text-base-content/70 mb-2">قيد المراجعة</h3>
            <p class="text-4xl font-bold text-info">{{ reviewStore.dashboardData.kpis.pendingAction }}</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-sm border border-base-200">
          <div class="card-body p-6 text-center">
            <h3 class="text-lg font-semibold text-base-content/70 mb-2">طلب تعديل</h3>
            <p class="text-4xl font-bold text-secondary">{{ reviewStore.dashboardData.kpis.needsModification }}</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-sm border border-base-200">
          <div class="card-body p-6 text-center">
            <h3 class="text-lg font-semibold text-base-content/70 mb-2">مكتملة</h3>
            <p class="text-4xl font-bold text-success">{{ reviewStore.dashboardData.kpis.completed }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Summaries can go here -->
      <div class="mt-8">
        <div class="card bg-base-100 shadow-sm border border-base-200">
          <div class="card-body">
            <h2 class="card-title text-xl mb-4">التوزيع العام لقرارات المراجعة</h2>
            <div class="flex flex-wrap gap-4">
              <div 
                v-for="(label, idx) in reviewStore.dashboardData.distribution.labels" 
                :key="idx"
                class="flex items-center gap-2 p-3 bg-base-200 rounded-lg"
              >
                <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: reviewStore.dashboardData.distribution.colors[idx] }"></div>
                <span class="font-semibold">{{ label }}</span>
                <span class="badge badge-neutral">{{ reviewStore.dashboardData.distribution.data[idx] }}</span>
              </div>
            </div>
            <p v-if="!reviewStore.dashboardData.distribution.labels.length" class="text-base-content/50">
              لا توجد بيانات كافية لعرض التوزيع
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useReviewStore } from '@/store/reviews';
import PageHeader from '@/components/common/PageHeader.vue';
import Spinner from '@/components/common/Spinner.vue';

const reviewStore = useReviewStore();

onMounted(() => {
  reviewStore.fetchDashboardKPIs();
});
</script>
