<template>
  <div class="min-h-screen bg-gray-50 flex justify-center items-center p-6" dir="rtl">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !receipt" class="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
      <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="w-10 h-10 text-red-500"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">عذراً، الإيصال غير موجود</h2>
      <p class="text-gray-500 mb-8">{{ error?.message || 'لا تملك صلاحية الوصول إلى هذا الإيصال أو أن المعاملة غير صحيحة.' }}</p>
      <button @click="$router.push('/student/payments/history')" class="btn btn-primary w-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> العودة للسجل
      </button>
    </div>

    <!-- Receipt Container -->
    <div v-else class="receipt-container bg-white rounded-3xl shadow-xl overflow-hidden max-w-lg w-full print:shadow-none print:max-w-none print:border print:border-gray-300">
      <!-- Decorator -->
      <div class="h-3 w-full bg-gradient-to-r from-primary to-accent print:hidden"></div>

      <div class="p-8 md:p-12 text-center">
        <!-- Success Badge -->
        <div v-if="receipt.status === 'completed' || receipt.status === 'paid'" class="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> عملية دفع ناجحة
        </div>
        <div v-else class="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold text-sm mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> لم تكتمل المعاملة
        </div>

        <h2 class="text-3xl font-black text-gray-800 mb-2">إيصال إلكتروني</h2>
        
        <div class="text-4xl font-black text-primary my-6" dir="ltr">
          {{ formatAmount(receipt.amount) }} <span class="text-lg text-gray-400">EGP</span>
        </div>

        <!-- Details -->
        <div class="text-right mt-8 pt-8 border-t-2 border-dashed border-gray-200 space-y-4">
          <div class="flex justify-between items-center text-sm md:text-base">
            <span class="font-semibold text-gray-500">رقم التسلسل (Serial):</span>
            <span class="font-bold text-gray-800 font-mono">{{ receipt.application?.serial_number || receipt.serial_number || '---' }}</span>
          </div>
          
          <div class="flex justify-between items-center text-sm md:text-base">
            <span class="font-semibold text-gray-500">المرجع المالي:</span>
            <span class="font-bold text-gray-800 font-mono">{{ receipt.transaction_reference || '---' }}</span>
          </div>

          <div class="flex justify-between items-center text-sm md:text-base">
            <span class="font-semibold text-gray-500">رقم أمر الدفع (Paymob):</span>
            <span class="font-bold text-gray-800 font-mono">{{ receipt.gateway_transaction_id || '---' }}</span>
          </div>

          <div class="flex justify-between items-center text-sm md:text-base">
            <span class="font-semibold text-gray-500">التاريخ والوقت:</span>
            <span class="font-bold text-gray-800" dir="ltr">{{ formatDate(receipt.paid_at || receipt.created_at) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 mt-10 print:hidden">
          <button @click="printReceipt" class="btn btn-outline flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m0 0a48.673 48.673 0 0 1 10.5 0m-10.5 0V6.169a2.25 2.25 0 0 1 2.028-2.242 48.219 48.219 0 0 1 6.444 0 2.25 2.25 0 0 1 2.028 2.242v1.038" /></svg> طباعة / PDF
          </button>
          <button @click="$router.push('/student/payments/history')" class="btn btn-primary flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg> العودة للسجل
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { paymentServices } from '@/services/paymentServices';

const route = useRoute();
const { getPaymentReceipt } = paymentServices();

const receipt = ref(null);
const isLoading = ref(true);
const error = ref(null);

const fetchReceipt = async () => {
  const paymentId = route.params.id;
  if (!paymentId) {
    error.value = new Error('لم يتم تحديد الإيصال');
    isLoading.value = false;
    return;
  }

  const res = await getPaymentReceipt(paymentId, (loading) => isLoading.value = loading, (err) => {
    if (err) error.value = err;
  });
  if (res && res.status) {
    receipt.value = res.data || res.payment || null;
  } else if (res && !res.status) {
    error.value = new Error(res.message || 'الإيصال غير موجود');
  }
};

const formatAmount = (amount) => {
  if (!amount && amount !== 0) return '0.00';
  return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (dateStr) => {
  if (!dateStr) return '---';
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { 
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: true 
  });
};

const printReceipt = () => {
  window.print();
};

onMounted(() => {
  fetchReceipt();
});
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  .receipt-container, .receipt-container * {
    visibility: visible;
  }
  .receipt-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    box-shadow: none;
  }
  /* Hide navbar/sidebar in main layout if they exist during print */
  header, footer, nav, aside {
    display: none !important;
  }
}
</style>
