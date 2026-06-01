<template>
  <div class="space-y-6">
    <PageHeader 
      title="إسناد المراجعين" 
      subtitle="إدارة الأبحاث قيد المراجعة وإسنادها للمراجعين المتاحين"
      icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Applications Under Review -->
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body">
          <h2 class="card-title text-lg border-b pb-2">الأبحاث التي تنتظر الإسناد</h2>
          <div v-if="reviewStore.loading && !reviewStore.applicationsUnderReview.length" class="flex justify-center p-6">
            <Spinner />
          </div>
          <div v-else class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>الرقم المرجعي</th>
                  <th>عنوان البحث</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="app in reviewStore.applicationsUnderReview" :key="app.id" :class="{'bg-base-200': selectedApp?.id === app.id}">
                  <td>{{ app.serial_number }}</td>
                  <td class="whitespace-normal max-w-xs">{{ app.title }}</td>
                  <td>
                    <button 
                      @click="selectApplication(app)" 
                      class="btn btn-sm"
                      :class="selectedApp?.id === app.id ? 'btn-primary' : 'btn-outline'"
                    >
                      اختيار
                    </button>
                  </td>
                </tr>
                <tr v-if="!reviewStore.applicationsUnderReview.length">
                  <td colspan="3" class="text-center py-4 text-base-content/50">لا توجد أبحاث قيد المراجعة حالياً</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Assign to Reviewers -->
      <div class="card bg-base-100 shadow-sm border border-base-200" :class="{'opacity-50 pointer-events-none': !selectedApp}">
        <div class="card-body">
          <h2 class="card-title text-lg border-b pb-2">المراجعين المتاحين</h2>
          <p v-if="selectedApp" class="text-sm text-primary mb-4 font-semibold">
            إسناد المراجعين للبحث: {{ selectedApp.serial_number }}
          </p>
          
          <div v-if="reviewStore.loading && !reviewStore.availableReviewers.length" class="flex justify-center p-6">
            <Spinner />
          </div>
          <div v-else class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>القسم</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rev in reviewStore.availableReviewers" :key="rev.id">
                  <td>{{ rev.full_name || rev.name }}</td>
                  <td>{{ rev.department || '-' }}</td>
                  <td>
                    <button 
                      @click="assign(rev.id)" 
                      class="btn btn-sm btn-success text-white"
                      :disabled="isAssigning"
                    >
                      إسناد
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useReviewStore } from '@/store/reviews';
import PageHeader from '@/components/common/PageHeader.vue';
import Spinner from '@/components/common/Spinner.vue';

const reviewStore = useReviewStore();

const selectedApp = ref(null);
const isAssigning = ref(false);

onMounted(() => {
  reviewStore.fetchApplicationsUnderReview();
  reviewStore.fetchAvailableReviewers();
});

const selectApplication = (app) => {
  selectedApp.value = app;
};

const assign = async (reviewerId) => {
  if (!selectedApp.value) return;
  
  if (confirm('هل أنت متأكد من إسناد البحث لهذا المراجع؟')) {
    isAssigning.value = true;
    const res = await reviewStore.assignReviewer(selectedApp.value.id, reviewerId);
    isAssigning.value = false;
    alert(res.message);
  }
};
</script>
