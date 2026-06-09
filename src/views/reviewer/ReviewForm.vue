<template>
  <div class="space-y-6 p-4 md:p-6">
    <PageHeader 
      title="تفاصيل البحث ومراجعته" 
      subtitle="عرض جميع بيانات البحث والمستندات المرفقة مع إمكانية تقديم قرار المراجعة"
      icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />

    <div v-if="reviewStore.loading" class="flex justify-center p-12">
      <Spinner />
    </div>

    <template v-else-if="reviewStore.currentReviewDetails">
      
      <!-- Status Banners -->
      <div v-if="app.current_stage === 'approved'" class="bg-gradient-to-br from-[#27ae60] to-[#2ecc71] text-white p-5 rounded-lg flex items-center gap-4 font-bold shadow-md mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <div>
          <div class="text-lg">تم الاعتماد النهائي من الإدارة</div>
          <div class="text-sm font-medium opacity-90 mt-0.5">هذا البحث حاصل على الموافقة النهائية ولا يمكن تعديل القرار.</div>
        </div>
      </div>

      <div v-if="app.current_stage === 'rejected'" class="bg-gradient-to-br from-[#cf0f2c] to-[#c42817] text-white p-5 rounded-lg flex items-center gap-4 font-bold shadow-md mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <div>
          <div class="text-lg">تم الرفض النهائي</div>
          <div class="text-sm font-medium opacity-90 mt-0.5">هذا البحث مرفوض نهائياً ولا يمكن تعديل القرار.</div>
        </div>
      </div>

      <!-- Application Details -->
      <div class="card bg-base-100 shadow-sm border border-base-200 mb-6">
        <div class="card-body p-6">
          <h3 class="card-title text-lg border-b pb-3 mb-4 text-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            بيانات البحث
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gradient-to-b from-slate-50 to-white p-4 rounded-lg border border-slate-200">
              <span class="text-[0.82rem] font-extrabold text-primary uppercase block mb-2">رقم الملف</span>
              <span class="bg-neutral text-neutral-content font-extrabold px-3 py-1.5 rounded-md text-sm shadow-sm border border-neutral-content/20">
                {{ app.serial_number || '—' }}
              </span>
            </div>
            
            <div class="bg-gradient-to-b from-slate-50 to-white p-4 rounded-lg border border-slate-200">
              <span class="text-[0.82rem] font-extrabold text-primary uppercase block mb-2">تاريخ التقديم</span>
              <div class="font-bold text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span dir="ltr">{{ formatDate(app.created_at) }}</span>
              </div>
            </div>

            <div class="bg-gradient-to-b from-slate-50 to-white p-4 rounded-lg border border-slate-200 md:col-span-2">
              <span class="text-[0.82rem] font-extrabold text-primary uppercase block mb-2">عنوان البحث</span>
              <div class="font-bold text-base-content flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-accent mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {{ app.title }}
              </div>
            </div>

            <div class="bg-gradient-to-b from-slate-50 to-white p-4 rounded-lg border border-slate-200">
              <span class="text-[0.82rem] font-extrabold text-primary uppercase block mb-2">الباحث الرئيسي</span>
              <div v-if="isBlinded" class="font-bold text-error flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                معلومات محجوبة
              </div>
              <div v-else class="font-bold text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ app.principal_investigator }}
              </div>
            </div>

            <div class="bg-gradient-to-b from-slate-50 to-white p-4 rounded-lg border border-slate-200">
              <span class="text-[0.82rem] font-extrabold text-primary uppercase block mb-2">الكلية / القسم</span>
              <div class="font-bold text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {{ app.faculty || 'غير متوفر' }} — {{ app.department || '' }}
              </div>
            </div>

            <div v-if="!isBlinded" class="bg-gradient-to-b from-slate-50 to-white p-4 rounded-lg border border-slate-200 md:col-span-2">
              <span class="text-[0.82rem] font-extrabold text-primary uppercase block mb-2">الباحثون المشاركون</span>
              <div v-if="coInvestigators.length > 0" class="flex flex-wrap gap-2">
                <span v-for="(co, i) in coInvestigators" :key="i" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-full text-[0.88rem] font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ co }}
                </span>
              </div>
              <div v-else class="text-sm font-semibold text-slate-500">لا يوجد باحثون مشاركون</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Documents -->
      <div class="card bg-base-100 shadow-sm border border-base-200 mb-6">
        <div class="card-body p-6">
          <h3 class="card-title text-lg border-b pb-3 mb-4 text-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
            المستندات المرفقة ({{ app.documents?.length || 0 }})
          </h3>

          <div v-if="!app.documents || app.documents.length === 0" class="text-center py-8 text-base-content/50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>لا توجد مستندات مرفقة لهذا البحث</p>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="doc in app.documents" :key="doc.id" class="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-100 rounded-lg p-4 flex items-center gap-3 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: getDocColor(doc.document_type) }">
                <i :class="['fa-solid text-white text-xl', getDocIcon(doc.document_type)]"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-base-content text-[0.92rem] mb-1 truncate">{{ getDocName(doc.document_type) }}</div>
                <div class="flex gap-2">
                  <a :href="`/storage/${doc.file_path}`" target="_blank" class="px-3 py-1 bg-white border-1.5 border-slate-200 rounded-md text-xs font-bold text-primary hover:bg-primary hover:text-white hover:border-primary transition-colors flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    عرض
                  </a>
                  <a :href="`/storage/${doc.file_path}`" download class="px-3 py-1 bg-white border-1.5 border-slate-200 rounded-md text-xs font-bold text-primary hover:bg-primary hover:text-white hover:border-primary transition-colors flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    تحميل
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Decision Form -->
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-6">
          <h3 class="card-title text-lg border-b pb-3 mb-4 text-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            قراري وتعليقاتي
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-1 border-l border-base-200 pl-4 space-y-4">
              <!-- Current Decision Status -->
              <div class="bg-base-200/50 p-4 rounded-lg">
                <p class="text-sm font-bold text-base-content/70 mb-2">القرار الحالي للمراجعة:</p>
                <span v-if="reviewStore.currentReviewDetails?.decision === 'pending'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold text-base-content/70 bg-base-200">
                  <i class="fa-solid fa-hourglass-half"></i> قيد المراجعة
                </span>
                <span v-else-if="reviewStore.currentReviewDetails?.decision === 'approved'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold text-[#155724] bg-[#d4edda]">
                  <i class="fa-solid fa-check-double"></i> مقبول
                </span>
                <span v-else-if="reviewStore.currentReviewDetails?.decision === 'rejected'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold text-[#721c24] bg-[#f8d7da]">
                  <i class="fa-solid fa-xmark"></i> مرفوض
                </span>
                <span v-else-if="reviewStore.currentReviewDetails?.decision === 'needs_modification'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold text-[#b9770e] bg-[#fdf2e9]">
                  <i class="fa-solid fa-pen"></i> يحتاج تعديل
                </span>
              </div>

              <!-- Past Comments History -->
              <div v-if="comments.length > 0">
                <h4 class="font-bold text-sm mb-3">سجل التعليقات السابقة</h4>
                <div class="space-y-3 max-h-64 overflow-y-auto pl-1">
                  <div v-for="c in comments" :key="c.id" class="bg-base-50 p-3 rounded-lg border-r-4 border-accent shadow-sm text-sm">
                    <p class="leading-relaxed">{{ c.comment }}</p>
                    <span class="text-[0.75rem] text-base-content/50 block mt-2 font-semibold" dir="ltr">{{ new Date(c.created_at).toLocaleString('ar-SA') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="md:col-span-2 space-y-5">
              <div class="form-control">
                <label class="label"><span class="label-text font-bold">قرار المراجعة <span class="text-error">*</span></span></label>
                <select v-model="form.decision" class="select select-bordered w-full" :disabled="isReadonly">
                  <option value="" disabled>-- اختر القرار --</option>
                  <option value="approved">موافقة</option>
                  <option value="needs_modification">طلب تعديل</option>
                  <option value="rejected">رفض</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label"><span class="label-text font-bold">ملاحظات وتعليقات</span></label>
                <textarea 
                  v-model="form.comment" 
                  class="textarea textarea-bordered h-32 text-base leading-relaxed" 
                  placeholder="أدخل ملاحظاتك هنا... (مطلوب في حال طلب التعديل أو الرفض)"
                  :disabled="isReadonly"
                ></textarea>
              </div>

              <div class="flex justify-end gap-3 mt-6">
                <router-link :to="{ name: 'AssignedResearches' }" class="btn btn-outline border-2 px-6">
                  عودة
                </router-link>
                <button 
                  class="btn btn-primary px-8 bg-gradient-to-r from-primary to-accent border-none text-white font-bold" 
                  @click="submit"
                  :disabled="isReadonly || isSubmitting || !isFormValid"
                >
                  <span v-if="isSubmitting" class="loading loading-spinner"></span>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
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
import { useReviewStore } from '@/store/reviews/index';
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

const isBlinded = computed(() => {
  return app.value.is_blinded || app.value.principal_investigator === 'معلومات محجوبة';
});

const coInvestigators = computed(() => {
  if (!app.value.co_investigators) return [];
  try {
    const parsed = JSON.parse(app.value.co_investigators);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
});

// Readonly if application is already approved or rejected at final stage
const isReadonly = computed(() => {
  return app.value.current_stage === 'approved' || app.value.current_stage === 'rejected';
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

const docLabels = {
  'protocol': ['بروتوكول البحث', 'fa-file-medical', '#2c3e50'],
  'conflict_of_interest': ['إقرار تعارض المصالح', 'fa-handshake-angle', '#e67e22'],
  'irb_checklist': ['قائمة فحص IRB', 'fa-list-check', '#1abc9c'],
  'pi_consent': ['موافقة الباحث الرئيسي', 'fa-user-pen', '#3498db'],
  'patient_consent': ['نموذج موافقة المرضى', 'fa-clipboard-user', '#9b59b6']
};

const getDocName = (type) => docLabels[type]?.[0] || type;
const getDocIcon = (type) => docLabels[type]?.[1] || 'fa-file';
const getDocColor = (type) => docLabels[type]?.[2] || '#7f8c8d';
</script>
