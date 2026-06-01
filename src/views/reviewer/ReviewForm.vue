<template>
  <div class="space-y-6">
    <PageHeader 
      title="نموذج المراجعة" 
      subtitle="اتخاذ القرار وإضافة الملاحظات للبحث"
      icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />

    <div v-if="reviewStore.loading" class="flex justify-center p-12">
      <Spinner />
    </div>

    <template v-else-if="reviewStore.currentReviewDetails">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Details & Documents Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <div class="card bg-base-100 shadow-sm border border-base-200">
            <div class="card-body">
              <h3 class="card-title text-lg border-b pb-2 mb-2">معلومات البحث</h3>
              <p class="text-sm font-semibold">الرقم المرجعي:</p>
              <p class="mb-2 text-base-content/80">{{ app.serial_number }}</p>
              
              <p class="text-sm font-semibold">العنوان:</p>
              <p class="mb-2 text-base-content/80">{{ app.title }}</p>

              <p class="text-sm font-semibold">الباحث الرئيسي:</p>
              <p class="mb-2 text-base-content/80">{{ app.principal_investigator }}</p>

              <p class="text-sm font-semibold">مرحلة البحث:</p>
              <span class="badge badge-neutral">{{ app.current_stage }}</span>
            </div>
          </div>

          <div class="card bg-base-100 shadow-sm border border-base-200">
            <div class="card-body">
              <h3 class="card-title text-lg border-b pb-2 mb-2">المستندات المرفقة</h3>
              <ul class="space-y-2">
                <li v-for="doc in app.documents" :key="doc.id">
                  <a :href="`/storage/${doc.file_path}`" target="_blank" class="link link-primary flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                    {{ doc.file_name || 'عرض المستند' }}
                  </a>
                </li>
              </ul>
              <p v-if="!app.documents || !app.documents.length" class="text-base-content/50 text-sm">
                لا توجد مستندات مرفقة
              </p>
            </div>
          </div>
        </div>

        <!-- Decision Form -->
        <div class="lg:col-span-2">
          <div class="card bg-base-100 shadow-sm border border-base-200 h-full">
            <div class="card-body">
              <h2 class="card-title text-xl mb-4">اتخاذ القرار</h2>

              <div class="form-control mb-6">
                <label class="label"><span class="label-text font-bold">قرار المراجعة <span class="text-error">*</span></span></label>
                <select v-model="form.decision" class="select select-bordered w-full" :disabled="isReadonly">
                  <option value="" disabled>-- اختر القرار --</option>
                  <option value="approved">موافقة</option>
                  <option value="needs_modification">طلب تعديل</option>
                  <option value="rejected">رفض</option>
                </select>
              </div>

              <div class="form-control mb-6">
                <label class="label"><span class="label-text font-bold">ملاحظات وتعليقات</span></label>
                <textarea 
                  v-model="form.comment" 
                  class="textarea textarea-bordered h-32" 
                  placeholder="أدخل ملاحظاتك هنا... (مطلوب في حال طلب التعديل أو الرفض)"
                  :disabled="isReadonly"
                ></textarea>
              </div>

              <!-- Past Comments History -->
              <div v-if="comments.length > 0" class="mb-6">
                <h4 class="font-bold text-sm mb-3">سجل التعليقات السابقة</h4>
                <div class="space-y-3 bg-base-200 p-4 rounded-lg max-h-48 overflow-y-auto">
                  <div v-for="c in comments" :key="c.id" class="bg-base-100 p-3 rounded shadow-sm text-sm">
                    <p>{{ c.comment }}</p>
                    <span class="text-xs text-base-content/50 block mt-1" dir="ltr">{{ new Date(c.created_at).toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <div class="card-actions justify-end mt-auto pt-4 border-t border-base-200">
                <button 
                  class="btn btn-primary" 
                  @click="submit"
                  :disabled="isReadonly || isSubmitting || !isFormValid"
                >
                  <span v-if="isSubmitting" class="loading loading-spinner"></span>
                  حفظ القرار
                </button>
              </div>

              <div v-if="isReadonly" class="alert alert-info mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>لا يمكن تعديل القرار لأن البحث قد تجاوز مرحلة المراجعة.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useReviewStore } from '@/store/reviews';
import PageHeader from '@/components/common/PageHeader.vue';
import Spinner from '@/components/common/Spinner.vue';

const route = useRoute();
const router = useRouter();
const reviewStore = useReviewStore();

const applicationId = route.params.id;

const form = ref({
  decision: '',
  comment: ''
});

const isSubmitting = ref(false);

onMounted(async () => {
  await reviewStore.fetchReviewDetails(applicationId);
  const review = reviewStore.currentReviewDetails;
  if (review) {
    form.value.decision = review.decision !== 'pending' ? review.decision : '';
  }
});

const app = computed(() => reviewStore.currentReviewDetails?.application || {});
const comments = computed(() => reviewStore.currentReviewDetails?.comments || []);

// Readonly if application is already approved
const isReadonly = computed(() => {
  return app.value.current_stage === 'approved';
});

const isFormValid = computed(() => {
  if (!form.value.decision) return false;
  if ((form.value.decision === 'needs_modification' || form.value.decision === 'rejected') && !form.value.comment.trim()) {
    return false;
  }
  return true;
});

const submit = async () => {
  isSubmitting.value = true;
  const result = await reviewStore.submitDecision(applicationId, form.value);
  isSubmitting.value = false;
  
  if (result.success) {
    alert('تم الحفظ بنجاح');
    router.push({ name: 'AssignedResearches' });
  } else {
    alert(result.message);
  }
};
</script>
