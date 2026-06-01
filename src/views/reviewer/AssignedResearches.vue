<template>
  <div class="space-y-6">
    <PageHeader 
      title="الأبحاث قيد المراجعة" 
      subtitle="قائمة بالأبحاث التي تم قبول مراجعتها بانتظار قرارك النهائي"
      icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />

    <DataTable 
      :data="reviewStore.activeAssignments" 
      :columns="columns"
      :loading="reviewStore.loading"
    >
      <template #cell(decision)="{ item }">
        <span v-if="item.decision === 'pending'" class="badge badge-info">قيد الانتظار</span>
        <span v-else-if="item.decision === 'needs_modification'" class="badge badge-warning">طلب تعديل</span>
        <span v-else-if="item.decision === 'approved'" class="badge badge-success text-white">موافقة</span>
        <span v-else-if="item.decision === 'rejected'" class="badge badge-error text-white">مرفوض</span>
        <span v-else class="badge badge-ghost">{{ item.decision }}</span>
      </template>

      <template #row-actions="{ item }">
        <router-link 
          :to="{ name: 'ReviewForm', params: { id: item.application_id } }" 
          class="btn btn-sm btn-primary"
        >
          مراجعة
        </router-link>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useReviewStore } from '@/store/reviews';
import PageHeader from '@/components/common/PageHeader.vue';
import DataTable from '@/components/common/DataTable.vue';

const reviewStore = useReviewStore();

const columns = [
  { key: 'serial_number', label: 'الرقم المرجعي' },
  { key: 'title', label: 'عنوان البحث' },
  { key: 'principal_investigator', label: 'الباحث الرئيسي' },
  { key: 'decision', label: 'القرار الحالي' },
  { key: 'current_stage', label: 'مرحلة البحث' }
];

onMounted(() => {
  reviewStore.fetchActiveAssignments();
});
</script>
