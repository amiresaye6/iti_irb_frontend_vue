<template>
  <div class="space-y-6">
    <PageHeader 
      title="بانتظار القبول" 
      subtitle="الأبحاث المسندة إليك والتي تتطلب قرارك بالقبول أو الرفض"
      icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />

    <DataTable 
      :data="reviewStore.pendingAssignments" 
      :columns="columns"
      :loading="reviewStore.loading"
    >
      <template #cell(assigned_at)="{ item }">
        <span dir="ltr">{{ new Date(item.assigned_at).toLocaleDateString('en-GB') }}</span>
      </template>

      <template #row-actions="{ item }">
        <div class="flex gap-2">
          <button 
            @click="accept(item.review_id)" 
            class="btn btn-sm btn-success text-white"
          >
            قبول
          </button>
          <button 
            @click="openRefuseModal(item.review_id)" 
            class="btn btn-sm btn-error text-white"
          >
            رفض
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Refusal Modal -->
    <dialog id="refusal_modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">سبب الرفض</h3>
        <p class="py-4">يرجى توضيح سبب رفضك لمراجعة هذا البحث:</p>
        <textarea 
          v-model="refusalReason" 
          class="textarea textarea-bordered w-full" 
          rows="4"
          placeholder="اكتب السبب هنا..."
        ></textarea>
        <div class="modal-action">
          <form method="dialog" class="flex gap-2">
            <button class="btn" @click="closeRefuseModal">إلغاء</button>
            <button 
              class="btn btn-error text-white" 
              @click.prevent="submitRefusal"
              :disabled="!refusalReason.trim() || isSubmitting"
            >
              تأكيد الرفض
            </button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useReviewStore } from '@/store/reviews';
import PageHeader from '@/components/common/PageHeader.vue';
import DataTable from '@/components/common/DataTable.vue';

const reviewStore = useReviewStore();

const columns = [
  { key: 'serial_number', label: 'الرقم المرجعي' },
  { key: 'title', label: 'عنوان البحث' },
  { key: 'principal_investigator', label: 'الباحث الرئيسي' },
  { key: 'department', label: 'القسم' },
  { key: 'assigned_by_name', label: 'تم الإسناد بواسطة' },
  { key: 'assigned_at', label: 'تاريخ الإسناد' }
];

const selectedReviewId = ref(null);
const refusalReason = ref('');
const isSubmitting = ref(false);

onMounted(() => {
  reviewStore.fetchPendingAssignments();
});

const accept = async (id) => {
  if (confirm('هل أنت متأكد من قبول المراجعة؟')) {
    await reviewStore.acceptAssignment(id);
  }
};

const openRefuseModal = (id) => {
  selectedReviewId.value = id;
  refusalReason.value = '';
  document.getElementById('refusal_modal').showModal();
};

const closeRefuseModal = () => {
  selectedReviewId.value = null;
  document.getElementById('refusal_modal').close();
};

const submitRefusal = async () => {
  if (!refusalReason.value.trim() || !selectedReviewId.value) return;
  
  isSubmitting.value = true;
  await reviewStore.refuseAssignment(selectedReviewId.value, refusalReason.value);
  isSubmitting.value = false;
  closeRefuseModal();
};
</script>
