<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
    <div class="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center relative overflow-hidden">
      <!-- Decorator background -->
      <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>

      <!-- Loading State -->
      <template v-if="status === 'loading'">
        <div class="py-10">
          <div class="relative w-24 h-24 mx-auto mb-6">
            <div class="absolute inset-0 rounded-full border-4 border-gray-100"></div>
            <div class="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">جاري التحقق من الدفع...</h2>
          <p class="text-gray-500">يرجى الانتظار، لا تقم بإغلاق أو تحديث هذه الصفحة.</p>
        </div>
      </template>

      <!-- Success State -->
      <template v-else-if="status === 'success'">
        <div class="py-6">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-green-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">اكتملت عملية الدفع بنجاح!</h2>
          <p class="text-gray-500 mb-8">تم تأكيد استلام المبلغ وتحديث حالة طلبك.</p>
          
          <div class="flex flex-col gap-3">
            <button v-if="paymentId" @click="goToReceipt" class="btn btn-primary w-full gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              عرض الإيصال
            </button>
            <button @click="goToHistory" class="btn btn-outline w-full gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              سجل المدفوعات
            </button>
            <button @click="goToDashboard" class="btn btn-ghost btn-sm w-full gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              العودة للوحة التحكم
            </button>
          </div>
        </div>
      </template>

      <!-- Pending State -->
      <template v-else-if="status === 'pending'">
        <div class="py-6">
          <div class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-amber-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">الدفع قيد المعالجة</h2>
          <p class="text-gray-500 mb-8">لم يتم تأكيد الدفع بعد. قد يستغرق الأمر بضع دقائق.</p>
          
          <div class="flex flex-col gap-3">
            <button @click="retryVerification" class="btn btn-primary w-full gap-2" :disabled="isRetrying">
              <span v-if="isRetrying" class="loading loading-spinner loading-sm"></span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
              إعادة التحقق
            </button>
            <button @click="goToPending" class="btn btn-outline w-full gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
              المدفوعات المعلقة
            </button>
          </div>
        </div>
      </template>

      <!-- Error State -->
      <template v-else-if="status === 'error'">
        <div class="py-6">
          <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">فشل عملية الدفع</h2>
          <p class="text-gray-500 mb-8">{{ errorMessage }}</p>
          
          <div class="flex gap-3 justify-center">
            <button @click="goToHistory" class="btn btn-outline">
              سجل المدفوعات
            </button>
            <button @click="goToPending" class="btn btn-primary">
              المحاولة مرة أخرى
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { paymentServices } from '@/services/paymentServices';

const route = useRoute();
const router = useRouter();
const { verifyPaymentStatus } = paymentServices();

const status = ref('loading');
const errorMessage = ref('عذراً، لم نتمكن من معالجة عملية الدفع الخاصة بك.');
const paymentId = ref(null);
const isRetrying = ref(false);

const verify = async () => {
  const queryParams = route.query;

  // Try to get the client_secret from localStorage (saved before redirect to Paymob)
  const clientSecret = localStorage.getItem('pending_client_secret');
  
  if (!clientSecret) {
    // Fallback: check Paymob query params for success/failure
    if (queryParams.success === 'true') {
      status.value = 'success';
      return;
    } else if (queryParams.success === 'false') {
      status.value = 'error';
      errorMessage.value = 'تم رفض عملية الدفع من بوابة الدفع.';
      return;
    }
    
    status.value = 'error';
    errorMessage.value = 'رابط التحقق غير صالح. لم يتم العثور على بيانات الدفع.';
    return;
  }

  const res = await verifyPaymentStatus(clientSecret, () => {}, (err) => {
    if (err) {
      status.value = 'error';
      errorMessage.value = err?.message || 'حدث خطأ أثناء الاتصال بالخادم للتحقق من الدفع.';
      console.error(err);
    }
  });

  if (res && res.status) {
    // The API response structure is:
    // { status: true, data: { success: true/false, is_paid: true/false, data: { paid: true/false, status: "intended" } } }
    const isPaid = res.data?.is_paid || res.data?.success || res.data?.data?.paid || res.payment_status === 'paid';
    
    if (isPaid) {
      status.value = 'success';
      // Try to extract payment ID for receipt link
      paymentId.value = res.payment?.id || res.data?.payment_id || null;
      // Clean up stored client_secret
      localStorage.removeItem('pending_client_secret');
    } else if (res.data?.data?.status === 'pending' || res.payment_status === 'pending') {
      status.value = 'pending';
    } else {
      status.value = 'error';
      errorMessage.value = res.message || 'لم يتم تأكيد عملية الدفع.';
    }
  } else if (res && !res.status) {
    status.value = 'error';
    errorMessage.value = res.message || 'فشل التحقق من حالة الدفع.';
  }
};

const retryVerification = async () => {
  isRetrying.value = true;
  status.value = 'loading';
  await verify();
  isRetrying.value = false;
};

const goToReceipt = () => {
  router.push(`/student/payments/receipt/${paymentId.value}`);
};

const goToHistory = () => {
  router.push('/student/payments/history');
};

const goToPending = () => {
  router.push('/student/payments/pending');
};

const goToDashboard = () => {
  router.push('/dashboard');
};

onMounted(() => {
  verify();
});
</script>
