<template>
  <div class="space-y-6">
    <PageHeader 
      title="سجل المراجعات" 
      subtitle="تاريخ الأبحاث التي تم إسنادها لك وقراراتك السابقة"
      icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />

    <DataTable 
      :data="reviewStore.assignmentHistory" 
      :columns="columns"
      :loading="reviewStore.loading"
    >
      <template #cell(assignment_status)="{ item }">
        <span v-if="item.assignment_status === 'awaiting_acceptance'" class="badge badge-warning">بانتظار القبول</span>
        <span v-else-if="item.assignment_status === 'accepted'" class="badge badge-success text-white">مقبول</span>
        <span v-else-if="item.assignment_status === 'refused'" class="badge badge-error text-white">مرفوض</span>
        <span v-else class="badge badge-ghost">{{ item.assignment_status }}</span>
      </template>

      <template #cell(decision)="{ item }">
        <template v-if="item.assignment_status === 'accepted'">
          <span v-if="item.decision === 'pending'" class="badge badge-info">قيد الانتظار</span>
          <span v-else-if="item.decision === 'needs_modification'" class="badge badge-warning">طلب تعديل</span>
          <span v-else-if="item.decision === 'approved'" class="badge badge-success text-white">موافقة</span>
          <span v-else-if="item.decision === 'rejected'" class="badge badge-error text-white">مرفوض</span>
        </template>
        <span v-else-if="item.assignment_status === 'refused'" class="text-xs text-base-content/50">
          سبب الرفض: {{ item.refusal_reason || 'غير محدد' }}
        </span>
        <span v-else class="text-xs text-base-content/50">-</span>
      </template>
      
      <template #cell(assigned_at)="{ item }">
        <span dir="ltr">{{ new Date(item.assigned_at).toLocaleDateString('en-GB') }}</span>
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
  { key: 'assignment_status', label: 'حالة الإسناد' },
  { key: 'decision', label: 'قرار المراجعة' },
  { key: 'assigned_at', label: 'تاريخ الإسناد' }
];

onMounted(() => {
  reviewStore.fetchAssignmentHistory();
});
</script>
