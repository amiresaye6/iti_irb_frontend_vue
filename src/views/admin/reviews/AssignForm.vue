<template>
  <div class="space-y-6 p-4 md:p-6">
    <div class="mb-6">
      <h2 class="text-primary text-2xl font-extrabold flex items-center gap-3 mb-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        إسناد مراجع
      </h2>
      <p class="text-base-content/60 text-sm font-medium">عرض تفاصيل البحث وإسناده للمراجع المناسب</p>
    </div>

    <!-- Feedback banners -->
    <div v-if="successMsg" class="alert alert-success shadow-sm">
      <i class="fa-solid fa-check-circle shrink-0 h-6 w-6"></i>
      <span>{{ successMsg }}</span>
    </div>
    <div v-if="errorMsg" class="alert alert-error shadow-sm">
      <i class="fa-solid fa-circle-exclamation shrink-0 h-6 w-6"></i>
      <span>{{ errorMsg }}</span>
    </div>

    <div v-if="reviewStore.loading && !application" class="flex justify-center p-12">
      <Spinner />
    </div>

    <template v-else-if="application">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Application Details + History -->
        <div class="lg:col-span-2 space-y-6">
          <div class="card bg-base-100 shadow-sm border border-base-200">
            <div class="card-body">
              <h2 class="card-title text-lg border-b pb-2 mb-4">تفاصيل البحث</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-base-200/50 p-4 rounded-lg border border-base-200">
                  <span class="text-xs font-bold text-primary uppercase block mb-2">الرقم المرجعي</span>
                  <span class="text-neutral-content font-extrabold px-3 py-1.5 rounded-md text-sm shadow-sm border border-neutral-content/20 mt-1 inline-block" style="background-color: oklch(35% 0.02 245)">
                    {{ application.serial_number || '—' }}
                  </span>
                </div>

                <div class="bg-base-200/50 p-4 rounded-lg border border-base-200">
                  <span class="text-xs font-bold text-primary uppercase block mb-1">الباحث الرئيسي</span>
                  <div class="font-bold text-base-content flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ application.principal_investigator }}
                  </div>
                </div>

                <div class="bg-base-200/50 p-4 rounded-lg border border-base-200 md:col-span-2">
                  <span class="text-xs font-bold text-primary uppercase block mb-1">عنوان البحث</span>
                  <div class="font-bold text-base-content">{{ application.title }}</div>
                </div>

                <div v-if="application.department" class="bg-base-200/50 p-4 rounded-lg border border-base-200">
                  <span class="text-xs font-bold text-primary uppercase block mb-1">القسم</span>
                  <div class="font-bold text-base-content">{{ application.department }}</div>
                </div>

                <div class="bg-base-200/50 p-4 rounded-lg border border-base-200">
                  <span class="text-xs font-bold text-primary uppercase block mb-1">تاريخ التقديم</span>
                  <div class="font-bold text-base-content flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span dir="ltr">{{ formatDate(application.created_at) }}</span>
                  </div>
                </div>

                <div v-if="coInvestigators.length > 0" class="bg-base-200/50 p-4 rounded-lg border border-base-200 md:col-span-2">
                  <span class="text-xs font-bold text-primary uppercase block mb-2">الباحثون المساعدون</span>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(co, i) in coInvestigators" :key="i" class="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-base-300 rounded-full text-sm font-bold shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {{ co }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Assignment History -->
          <div class="card bg-base-100 shadow-sm border border-base-200">
            <div class="card-body">
              <h2 class="card-title text-lg border-b pb-2 mb-4">سجل الإسناد</h2>

              <div v-if="loadingHistory" class="flex justify-center py-6">
                <span class="loading loading-spinner text-primary"></span>
              </div>
              <div v-else-if="history.length === 0" class="text-center py-6 text-base-content/50">
                <i class="fa-solid fa-inbox text-3xl opacity-30 mb-2"></i>
                <p>لا يوجد سجل إسناد سابق لهذا البحث</p>
              </div>
              <ul v-else class="space-y-3">
                <li v-for="item in history" :key="item.review_id" class="p-4 bg-base-200/30 border border-base-200 rounded-lg flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div class="font-bold text-base-content mb-1">
                      المراجع: {{ item.reviewer_name || '—' }}
                    </div>
                    <div class="text-sm text-base-content/70">
                      <span class="font-semibold">الحالة:</span>
                      <span v-if="item.assignment_status === 'awaiting_acceptance'" class="text-warning font-bold"> بانتظار القبول</span>
                      <span v-else-if="item.assignment_status === 'accepted'" class="text-success font-bold"> مقبول</span>
                      <span v-else-if="item.assignment_status === 'refused'" class="text-error font-bold"> مرفوض</span>
                      <span v-else class="font-bold"> {{ item.assignment_status }}</span>
                    </div>
                    <div v-if="item.assignment_status !== 'refused'" class="text-sm font-semibold">
                      <span>القرار:</span>
                      <span v-if="item.decision === 'pending'" class="text-warning"> قيد المراجعة</span>
                      <span v-else-if="item.decision === 'approved'" class="text-success"> موافقة</span>
                      <span v-else-if="item.decision === 'rejected'" class="text-error"> رفض</span>
                      <span v-else-if="item.decision === 'needs_modification'" class="text-warning"> يحتاج تعديل</span>
                    </div>
                    <div v-if="item.assignment_status === 'refused'" class="text-sm text-error mt-1 italic">
                      سبب الرفض: {{ item.refusal_reason || 'غير محدد' }}
                    </div>
                  </div>
                  <div class="text-left text-sm font-bold text-base-content/60" dir="ltr">
                    {{ formatDate(item.assigned_at) }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Assign Action Panel -->
        <div class="space-y-6">
          <div class="card bg-base-100 shadow-sm border border-base-200">
            <div class="card-body">
              <h2 class="card-title text-lg border-b pb-2 mb-4">إسناد مراجع جديد</h2>

              <div class="form-control w-full mb-4">
                <label class="label">
                  <span class="label-text font-bold">اختر المراجع المناسب:</span>
                </label>
                <select v-model="selectedReviewer" class="select select-bordered w-full" :disabled="isAssigning">
                  <option value="" disabled>-- قائمة المراجعين --</option>
                  <option v-for="rev in availableReviewersFiltered" :key="rev.id" :value="rev.id">
                    {{ rev.full_name || rev.name }} {{ rev.department ? `(${rev.department})` : '' }}
                  </option>
                </select>
                <div v-if="availableReviewersFiltered.length === 0 && !reviewStore.loading" class="text-xs text-warning mt-2 font-semibold">
                  جميع المراجعين المتاحين تم إسنادهم لهذا البحث مسبقاً.
                </div>
              </div>

              <button
                class="btn btn-primary w-full gap-2"
                :disabled="!selectedReviewer || isAssigning"
                @click="assignReviewer"
              >
                <span v-if="isAssigning" class="loading loading-spinner"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                إسناد البحث للمراجع
              </button>

              <div class="mt-4 border-t border-base-200 pt-4">
                <router-link :to="{ name: 'AssignReviewers' }" class="btn btn-outline w-full">
                  عودة لقائمة الأبحاث
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-12">
      <h3 class="text-xl font-bold text-error">البحث غير موجود</h3>
      <router-link :to="{ name: 'AssignReviewers' }" class="btn btn-primary mt-4">عودة</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useReviewStore } from '@/store/reviews/index';
import Spinner from '@/components/common/Spinner.vue';

const route = useRoute();
const router = useRouter();
const reviewStore = useReviewStore();

const applicationId = route.params.id;
const application = ref(null);
const history = ref([]);
const coInvestigators = ref([]);

const selectedReviewer = ref('');
const isAssigning = ref(false);
const loadingHistory = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

// Just use the reviewers returned from backend since they are already filtered
const availableReviewersFiltered = computed(() => reviewStore.availableReviewers);

const loadData = async () => {
  await reviewStore.fetchApplicationsUnderReview();
  await reviewStore.fetchAvailableReviewers(applicationId);

  const app = reviewStore.applicationsUnderReview.find(a => a.id == applicationId);
  if (app) {
    application.value = app;

    if (app.co_investigators) {
      try {
        const parsed = JSON.parse(app.co_investigators);
        coInvestigators.value = Array.isArray(parsed) ? parsed : [];
      } catch {
        coInvestigators.value = [];
      }
    }
  }

  // Load assignment history from dedicated endpoint
  await loadHistory();
};

const loadHistory = async () => {
  loadingHistory.value = true;
  const res = await reviewStore.fetchApplicationAssignmentHistory(applicationId);
  loadingHistory.value = false;
  if (res.success && Array.isArray(res.data)) {
    history.value = res.data;
  }
};

onMounted(() => {
  loadData();
});

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  } catch { return dateStr; }
};

const assignReviewer = async () => {
  if (!selectedReviewer.value) return;

  successMsg.value = '';
  errorMsg.value = '';
  isAssigning.value = true;

  try {
    const res = await reviewStore.assignReviewer(applicationId, selectedReviewer.value);
    if (res.success) {
      successMsg.value = res.message || 'تم إسناد البحث للمراجع بنجاح وسيصله إشعار بذلك.';
      selectedReviewer.value = '';
      await loadData(); // Refresh history + reviewer list
    } else {
      errorMsg.value = res.message || 'حدث خطأ أثناء الإسناد';
    }
  } catch {
    errorMsg.value = 'حدث خطأ غير متوقع أثناء الإسناد';
  } finally {
    isAssigning.value = false;
  }
};
</script>
