<template>
  <div class="space-y-6 p-4 md:p-6">
    <PageHeader 
      title="إسناد مراجع" 
      subtitle="عرض تفاصيل البحث وإسناده للمراجع المناسب"
      icon="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
    />

    <div v-if="reviewStore.loading && !application" class="flex justify-center p-12">
      <Spinner />
    </div>

    <template v-else-if="application">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Application Details -->
        <div class="lg:col-span-2 space-y-6">
          <div class="card bg-base-100 shadow-sm border border-base-200">
            <div class="card-body">
              <h2 class="card-title text-lg border-b pb-2 mb-4">تفاصيل البحث</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-base-200/50 p-4 rounded-lg border border-base-200">
                  <span class="text-xs font-bold text-primary uppercase block mb-2">الرقم المرجعي</span>
                  <span class="bg-neutral text-neutral-content font-extrabold px-3 py-1.5 rounded-md text-sm shadow-sm border border-neutral-content/20">
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
              <div v-if="history.length === 0" class="text-center py-6 text-base-content/50">
                لا يوجد سجل إسناد سابق لهذا البحث
              </div>
              <ul v-else class="space-y-3">
                <li v-for="item in history" :key="item.id" class="p-4 bg-base-200/30 border border-base-200 rounded-lg flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div class="font-bold text-base-content mb-1">المراجع: {{ item.full_name }}</div>
                    <div class="text-sm text-base-content/70">
                      <span class="font-semibold">الحالة:</span> 
                      <span v-if="item.assignment_status === 'awaiting_acceptance'" class="text-warning">بانتظار القبول</span>
                      <span v-else-if="item.assignment_status === 'accepted'" class="text-success">مقبول</span>
                      <span v-else-if="item.assignment_status === 'refused'" class="text-error">مرفوض</span>
                      <span v-else>{{ item.assignment_status }}</span>
                    </div>
                    <div v-if="item.assignment_status === 'refused'" class="text-sm text-error mt-1 italic">
                      سبب الرفض: {{ item.refusal_reason || 'غير محدد' }}
                    </div>
                  </div>
                  <div class="text-left text-sm font-bold text-base-content/60" dir="ltr">
                    {{ formatDate(item.assigned_at) }}<br/>
                    {{ formatTime(item.assigned_at) }}
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
              <h2 class="card-title text-lg border-b pb-2 mb-4">حالة الإسناد الحالية</h2>
              
              <div v-if="!activeAssignment" class="alert alert-warning shadow-sm mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>لم يتم إسناد هذا البحث لأي مراجع حالياً. يرجى اختيار مراجع من القائمة أدناه.</span>
              </div>
              
              <div v-else-if="activeAssignment.assignment_status === 'awaiting_acceptance'" class="alert alert-info shadow-sm mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>بانتظار رد المراجع <strong>{{ activeAssignment.full_name }}</strong>.</span>
              </div>
              
              <div v-else-if="activeAssignment.assignment_status === 'accepted'" class="alert alert-success text-white shadow-sm mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>المراجع <strong>{{ activeAssignment.full_name }}</strong> قَبِلَ المراجعة وجاري العمل عليها.</span>
              </div>
              
              <!-- Only show form if no active assignment OR if we want to re-assign? The legacy logic usually only allows assign if no active assignment. -->
              <div v-if="!activeAssignment">
                <div class="form-control w-full mb-4">
                  <label class="label">
                    <span class="label-text font-bold">اختر المراجع المناسب:</span>
                  </label>
                  <select v-model="selectedReviewer" class="select select-bordered w-full" :disabled="isAssigning">
                    <option value="" disabled>-- قائمة المراجعين --</option>
                    <option v-for="rev in reviewStore.availableReviewers" :key="rev.id" :value="rev.id">
                      {{ rev.full_name || rev.name }} {{ rev.department ? `(${rev.department})` : '' }}
                    </option>
                  </select>
                </div>
                
                <button 
                  class="btn btn-primary w-full gap-2" 
                  :disabled="!selectedReviewer || isAssigning"
                  @click="assignReviewer"
                >
                  <Spinner v-if="isAssigning" size="sm" />
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  إسناد البحث
                </button>
              </div>
              
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
import PageHeader from '@/components/common/PageHeader.vue';
import Spinner from '@/components/common/Spinner.vue';

const route = useRoute();
const router = useRouter();
const reviewStore = useReviewStore();

const applicationId = route.params.id;
const application = ref(null);
const history = ref([]);
const activeAssignment = ref(null);
const coInvestigators = ref([]);

const selectedReviewer = ref('');
const isAssigning = ref(false);

const loadData = async () => {
  // We need an API endpoint to get a single application's details
  // For now, let's try to get it from the store if it's already loaded, 
  // or fetch all and find it.
  await reviewStore.fetchApplicationsUnderReview();
  await reviewStore.fetchAvailableReviewers();
  
  const app = reviewStore.applicationsUnderReview.find(a => a.id == applicationId);
  if (app) {
    application.value = app;
    activeAssignment.value = app.active_assignment;
    
    // Attempt to parse co-investigators if it exists
    if (app.co_investigators) {
      try {
        const parsed = JSON.parse(app.co_investigators);
        coInvestigators.value = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        coInvestigators.value = [];
      }
    }
    
    // In a real app we'd fetch history for this specific app
    // Fake it for now if we don't have an endpoint, or call it if we do
    // The legacy php got `$history = $reviewsObj->getAssignmentHistory($application_id);`
    // Assuming we have this data or can get it from the API
    try {
      // Assuming a method like this exists or will exist in store
      // history.value = await reviewStore.fetchApplicationAssignmentHistory(applicationId);
      // For now we leave it empty if there's no specific endpoint ready
      history.value = []; 
    } catch (e) {
      console.error(e);
    }
  }
};

onMounted(() => {
  loadData();
});

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

const assignReviewer = async () => {
  if (!selectedReviewer.value) return;
  if (confirm('هل أنت متأكد من إسناد البحث لهذا المراجع؟')) {
    isAssigning.value = true;
    try {
      const res = await reviewStore.assignReviewer(applicationId, selectedReviewer.value);
      alert(res.message || 'تم الإسناد بنجاح');
      await loadData(); // Reload to see active assignment
    } catch (error) {
      alert('حدث خطأ أثناء الإسناد');
    } finally {
      isAssigning.value = false;
    }
  }
};
</script>
