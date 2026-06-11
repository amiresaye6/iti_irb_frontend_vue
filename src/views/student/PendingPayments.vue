<template>
  <div class="p-6 min-h-screen" dir="rtl">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-8 h-8 text-primary"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg> المدفوعات المستحقة
        </h1>
        <p class="text-gray-500 mt-2 text-sm">
          إدارة الفواتير ورسوم تقديم الأبحاث المطلوبة لاستكمال المراجعة
        </p>
      </div>
      <router-link to="/student/payments/history" class="btn btn-outline btn-primary gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> سجل المدفوعات
      </router-link>
    </div>

    <!-- Filters and Search Bar -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div class="form-control w-full">
          <label class="label"><span class="label-text font-semibold">بحث</span></label>
          <div class="relative">
            <input type="text" v-model="filters.search" @input="debouncedFetch"
              placeholder="رقم الملف، العنوان..."
              class="input input-bordered w-full pr-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-5 h-5 absolute right-3 top-3.5 text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          </div>
        </div>
        
        <div class="form-control w-full">
          <label class="label"><span class="label-text font-semibold">ترتيب حسب</span></label>
          <select v-model="filters.sort_by" @change="fetchPayments" class="select select-bordered w-full">
            <option value="created_at">تاريخ الإضافة</option>
            <option value="amount">المبلغ</option>
          </select>
        </div>

        <div class="form-control w-full">
          <label class="label"><span class="label-text font-semibold">اتجاه الترتيب</span></label>
          <select v-model="filters.sort_order" @change="fetchPayments" class="select select-bordered w-full">
            <option value="desc">تنازلي</option>
            <option value="asc">تصاعدي</option>
          </select>
        </div>

        <button @click="resetFilters" class="btn btn-ghost text-error">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></svg> إعادة ضبط
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error shadow-lg mb-8 rounded-xl">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
      <div>
        <h3 class="font-bold">حدث خطأ</h3>
        <div class="text-xs">{{ error.message || 'فشل في جلب البيانات' }}</div>
      </div>
      <button class="btn btn-sm" @click="fetchPayments">إعادة المحاولة</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!payments.length" class="bg-white rounded-3xl shadow-sm border border-green-100 p-16 text-center">
      <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-12 h-12 text-green-500"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-800 mb-2">لا توجد فواتير مستحقة الدفع</h3>
      <p class="text-gray-500">جميع أبحاثك في المراحل التالية للمراجعة أو لم تتطلب دفعاً بعد.</p>
    </div>

    <!-- Data Grid -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="app in payments" :key="app.payment_id"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col group">
          
          <div class="bg-gray-50/50 p-5 border-b border-gray-100 flex justify-between items-start">
            <div class="badge badge-primary badge-outline font-mono font-bold">{{ app.serial_number }}</div>
            <div class="tooltip tooltip-right" data-tip="معرف الطلب">
               <span class="text-xs text-gray-400">#{{ app.application_id }}</span>
            </div>
          </div>
          
          <div class="p-6 flex-grow flex flex-col">
            <h3 class="text-lg font-bold text-gray-800 mb-4 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {{ app.title }}
            </h3>
            
            <div class="space-y-3 mb-6 flex-grow">
              <div class="flex items-center gap-3 text-sm text-gray-600">
                <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <svg v-if="app.current_stage === 'awaiting_initial_payment'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                </div>
                <span>رسوم الطلب</span>
              </div>
              
              <div v-if="app.calculated_size" class="flex items-center gap-3 text-sm text-gray-600">
                <div class="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>
                </div>
                <span>{{ app.calculated_size }} مشارك (حجم العينة)</span>
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 flex justify-between items-center">
              <span class="text-gray-500 text-sm font-semibold">المبلغ المطلوب</span>
              <div class="text-2xl font-black text-primary" dir="ltr">
                {{ formatAmount(app.amount || (app.current_stage === 'awaiting_initial_payment' ? 500 : app.sample_amount)) }} <span class="text-sm font-bold text-gray-400">EGP</span>
              </div>
            </div>

            <button @click="initiateCheckout(app.application_id)" :disabled="isCheckingOut === app.application_id"
              class="btn btn-primary w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl text-lg h-14">
              <span v-if="isCheckingOut === app.application_id" class="loading loading-spinner"></span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
              إتمام الدفع عبر Paymob
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-10 bg-white p-4 rounded-2xl shadow-sm border border-gray-100" v-if="pagination.total > pagination.per_page">
        <div class="text-sm text-gray-500">
          إجمالي النتائج: <span class="font-bold text-gray-800">{{ pagination.total }}</span>
        </div>
        <div class="join">
          <button class="join-item btn btn-sm" :disabled="pagination.page === 1" @click="changePage(pagination.page - 1)">
            السابق
          </button>
          <button class="join-item btn btn-sm btn-active pointer-events-none">
            {{ pagination.page }}
          </button>
          <button class="join-item btn btn-sm" :disabled="pagination.page * pagination.per_page >= pagination.total" @click="changePage(pagination.page + 1)">
            التالي
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { paymentServices } from '@/services/paymentServices';
import { toast } from 'vue-sonner';

const { getPendingPayments, initiateCheckout: checkoutApi } = paymentServices();

const payments = ref([]);
const isLoading = ref(true);
const error = ref(null);
const isCheckingOut = ref(null);

const filters = ref({
  search: '',
  sort_by: 'created_at',
  sort_order: 'desc',
  page: 1,
  per_page: 9
});

const pagination = ref({
  total: 0,
  page: 1,
  per_page: 9
});

let debounceTimeout = null;

const fetchPayments = async () => {
  error.value = null;
  const res = await getPendingPayments(filters.value, (loading) => isLoading.value = loading, (err) => {
    if (err) error.value = err;
  });
  if (res && res.status) {
    payments.value = res.data?.payments || res.data || [];
    // console.log(res);
    
    if (res.pagination) {
      pagination.value = res.pagination;
    }
  }
};

const debouncedFetch = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    filters.value.page = 1; // reset to first page on search
    fetchPayments();
  }, 500);
};

const resetFilters = () => {
  filters.value = {
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    page: 1,
    per_page: 9
  };
  fetchPayments();
};

const changePage = (newPage) => {
  filters.value.page = newPage;
  fetchPayments();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const formatAmount = (amount) => {
  if (!amount && amount !== 0) return '0.00';
  return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const initiateCheckout = async (appId) => {
  isCheckingOut.value = appId;
  const res = await checkoutApi(appId, () => {}, (err) => {
    if (err) {
      toast.error('حدث خطأ أثناء بدء عملية الدفع');
      console.error(err);
    }
  });
  
  isCheckingOut.value = null;

  if (res && res.status && res.data?.checkout_url) {
    if (res.data.client_secret) {
        localStorage.setItem('pending_client_secret', res.data.client_secret);
    }
    toast.success('جارٍ إعادة التوجيه لبوابة الدفع...');
    window.location.href = res.data.checkout_url;
  } else if (res && !res.status) {
    toast.error(res.message || 'فشل في بدء عملية الدفع');
  }
};

onMounted(() => {
  fetchPayments();
});
</script>
