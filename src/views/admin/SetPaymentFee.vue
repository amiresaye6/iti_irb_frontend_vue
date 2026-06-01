<template>
  <div class="p-4 sm:p-8 min-h-screen space-y-6 sm:space-y-8 w-full" dir="rtl">

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-gray-800 flex items-center gap-3">
          <span class="p-2.5 bg-primary/10 text-primary rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </span>
          تحديد الرسوم المالية للطلب
        </h1>
        <p class="text-gray-500 mt-2 text-sm sm:text-base">
          حدد ما إذا كان الطلب معفياً من الرسوم أم يتطلب سداد مبلغ محدد للانتقال للمرحلة النهائية وإصدار الشهادة.
        </p>
      </div>

      <router-link to="/admin/payments"
        class="btn btn-outline btn-sm btn-primary rounded-xl gap-2 h-10 w-full sm:w-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
        </svg>
        لوحة المدفوعات
      </router-link>
    </div>

    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm gap-4">
      <div class="flex items-center gap-3">
        <span class="p-2.5 bg-primary/10 text-primary rounded-xl font-black text-sm">#</span>
        <div>
          <span class="text-xs text-gray-400 block font-semibold">تحديد الرسوم لطلب البحث رقم:</span>
          <span class="font-bold text-gray-800 text-base font-mono">ID: {{ appId }}</span>
        </div>
      </div>
      <span
        class="badge badge-primary badge-outline badge-md py-3.5 px-4 font-bold rounded-xl w-full sm:w-auto text-center">
        بانتظار تحديد الرسوم
      </span>
    </div>

    <div v-if="successMessage"
      class="alert bg-green-50 text-green-700 border border-green-200 rounded-2xl p-4 shadow-sm flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-500 shrink-0 mt-0.5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <div>
        <h4 class="font-bold text-sm">{{ successMessage }}</h4>
        <p class="text-xs mt-1 text-green-600">تم تسجيل المعاملة بنجاح، وسينتقل الطلب في النظام للمرحلة التالية.</p>
      </div>
    </div>

    <div v-if="error" class="alert alert-error rounded-2xl p-4 shadow-sm flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-500 shrink-0 mt-0.5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
      <div>
        <h4 class="font-bold text-sm">حدث خطأ</h4>
        <p class="text-xs mt-1">{{ error.message || 'يرجى مراجعة البيانات والمحاولة مرة أخرى.' }}</p>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-bold text-gray-800 mb-1">اختر خيار تحديد الرسوم المناسب:</h3>
      <p class="text-gray-400 text-sm">حدد ما إذا كان الطلب معفياً بالكامل من الرسوم أم يتطلب سداد مبلغ معين.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

      <div @click="selectedMode = 'free'" :class="[
        'cursor-pointer p-5 sm:p-6 rounded-2xl border-2 transition-all relative flex flex-col justify-between hover:shadow-md h-full min-h-45',
        selectedMode === 'free'
          ? 'border-primary bg-primary/5 shadow-sm shadow-primary/5'
          : 'border-gray-100 bg-white hover:border-gray-200'
      ]">
        <div v-if="selectedMode === 'free'"
          class="absolute top-4 left-4 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <div>
          <div class="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9 9 6-6m0 0 6 6m-6-6v12a3 3 0 0 1-3 3H5" />
            </svg>
          </div>
          <h4 class="font-extrabold text-gray-800 text-base mb-1.5">إعفاء من الرسوم (مجاني)</h4>
          <p class="text-xs text-gray-500 leading-relaxed">تخطّي مرحلة المطالبة بالدفع تماماً وتأهيل الطلب للاعتماد
            المباشر.</p>
        </div>

        <div class="mt-4 pt-4 border-t border-dashed border-gray-200/60 text-xs text-gray-400 flex items-start gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 text-blue-500 shrink-0" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <span><strong>التأثير:</strong> سيتم تعيين مبلغ المعاملة بـ 0.00 EGP ونقل حالة الطلب تلقائياً إلى مقبول
            نهائياً (Approved).</span>
        </div>
      </div>

      <div @click="selectedMode = 'custom'" :class="[
        'cursor-pointer p-5 sm:p-6 rounded-2xl border-2 transition-all relative flex flex-col justify-between hover:shadow-md h-full min-h-45',
        selectedMode === 'custom'
          ? 'border-primary bg-primary/5 shadow-sm shadow-primary/5'
          : 'border-gray-100 bg-white hover:border-gray-200'
      ]">
        <div v-if="selectedMode === 'custom'"
          class="absolute top-4 left-4 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <div>
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h4 class="font-extrabold text-gray-800 text-base mb-1.5">رسوم مالية مخصصة</h4>
          <p class="text-xs text-gray-500 leading-relaxed">تحديد مبلغ سداد مالي بالجنيه المصري يجب على الباحث سداده
            إلكترونياً.</p>
        </div>

        <div class="mt-4 pt-4 border-t border-dashed border-gray-200/60 text-xs text-gray-400 flex items-start gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 text-blue-500 shrink-0" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <span><strong>التأثير:</strong> سيصل إشعار للباحث للدفع عبر بوابة Paymob، ويتأهل الطلب بعد السداد لإصدار
            الشهادة.</span>
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm transition-all flex flex-col items-center">

      <div v-if="selectedMode === 'free'" class="w-full max-w-md space-y-5 text-center">
        <div class="text-sm text-gray-500 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
          يرجى تأكيد إعفاء الباحث لطلب البحث رقم <strong class="text-gray-800">(#{{ appId }})</strong> من الرسوم
          بالكامل.<br /> سيتم قيد المعاملة بقيمة <strong class="text-green-600">(0.00 EGP)</strong> وسيتم ترحيل الطلب
          مباشرة للموافقة.
        </div>
        <button @click="submitFee(0)"
          class="btn btn-success text-white w-full h-12 rounded-xl font-bold shadow-md shadow-green-100 hover:shadow-green-200 transition-all gap-2"
          :disabled="isSubmitting">
          <span v-if="isSubmitting" class="loading loading-spinner"></span>
          <span v-else>حفظ المعاملة كإعفاء كامل</span>
        </button>
      </div>

      <div v-else-if="selectedMode === 'custom'" class="w-full max-w-md space-y-5">
        <div class="form-control w-full">
          <label class="label pt-0 pb-2">
            <span class="label-text font-bold text-gray-700 text-sm">مبلغ الرسوم المطلوب سداده (بالجنيه المصري
              EGP)</span>
          </label>
          <div class="relative">
            <input type="number" v-model="customAmount" required min="1" step="0.01" placeholder="مثال: 1500"
              class="input input-bordered w-full pr-12 text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
              :disabled="isSubmitting" />
            <div class="absolute right-4 top-3.5 text-gray-400 font-bold text-sm">EGP</div>
          </div>
        </div>

        <button @click="submitFee(customAmount)"
          class="btn btn-primary w-full h-12 rounded-xl font-bold shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all gap-2"
          :disabled="isSubmitting || !customAmount || customAmount <= 0">
          <span v-if="isSubmitting" class="loading loading-spinner"></span>
          <span v-else>حفظ المعاملة وتحديد الرسوم</span>
        </button>
      </div>

    </div>

    <div v-if="responseData" class="border-t border-gray-200 pt-6 space-y-4">
      <h4 class="font-bold text-gray-800 text-sm flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-green-500"></span>
        تفاصيل الفاتورة المسجلة:
      </h4>
      <div
        class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <span class="text-gray-400 block mb-1">رقم فاتورة النظام</span>
          <span class="font-mono font-bold text-gray-700 text-sm">#{{ responseData.payment?.id || 'غير معروف' }}</span>
        </div>
        <div>
          <span class="text-gray-400 block mb-1">الحالة الحالية</span>
          <span class="badge badge-sm font-bold"
            :class="responseData.payment?.status === 'pending' ? 'badge-warning' : 'badge-success'">
            {{ responseData.payment?.status === 'pending' ? 'بانتظار السداد إلكترونياً' : 'مكتمل / معفى' }}
          </span>
        </div>
        <div>
          <span class="text-gray-400 block mb-1">قيمة الرسوم</span>
          <span class="font-black text-gray-800 text-sm">{{ formatAmount(responseData.payment?.amount) }} EGP</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { paymentServices } from '@/services/paymentServices';
import { toast } from 'vue-sonner';

const route = useRoute();

const { setPaymentFee } = paymentServices();

// Get App ID from route parameters
const appId = ref(route.params.id);

// UI and Form input values
const selectedMode = ref('custom'); // 'free' or 'custom'
const customAmount = ref('');
const isSubmitting = ref(false);
const error = ref(null);
const successMessage = ref('');
const responseData = ref(null);

// Form submit function
const submitFee = async (amountValue) => {
  if (!appId.value) {
    toast.error('خطأ: معرف الطلب غير متاح.');
    return;
  }

  const numericAmount = Number(amountValue);
  if (selectedMode.value === 'custom' && (isNaN(numericAmount) || numericAmount <= 0)) {
    toast.error('يرجى إدخال مبلغ صحيح أكبر من الصفر.');
    return;
  }

  error.value = null;
  successMessage.value = '';
  responseData.value = null;

  const res = await setPaymentFee(
    appId.value,
    numericAmount,
    (loading) => isSubmitting.value = loading,
    (err) => {
      if (err) {
        error.value = err;
        toast.error(err.message || 'فشل في حفظ الرسوم. يرجى المحاولة مرة أخرى.');
      }
    }
  );

  if (res && res.status) {
    const successText = numericAmount === 0
      ? 'تم إعفاء الطلب بنجاح ونقله للمرحلة التالية.'
      : `تم تحديد الرسوم بقيمة ${formatAmount(numericAmount)} EGP بنجاح.`;

    successMessage.value = successText;
    responseData.value = res.data || null;
    toast.success(successText);

    // Clear inputs on success
    customAmount.value = '';
  } else if (res && !res.status) {
    const errorText = res.message || 'فشل تسجيل المعاملة.';
    error.value = new Error(errorText);
    toast.error(errorText);
  }
};

// Formatting helpers
const formatAmount = (amount) => {
  if (!amount && amount !== 0) return '0.00';
  return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

onMounted(() => {
  appId.value = route.params.id;
});
</script>

<style scoped>
.font-sans {
  font-family: 'Cairo', sans-serif;
}
</style>