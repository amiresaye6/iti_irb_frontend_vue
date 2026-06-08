<template>
  <div class="p-6 min-h-screen text-base-content" dir="rtl" v-if="application">
    
    <PageHeader :title="`مراجعة البحث: ${application.serial_number}`" note="يرجى مراجعة تفاصيل البحث والملفات المرفقة بعناية قبل اتخاذ القرار النهائي." />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      
      <div class="lg:col-span-2 space-y-6">
        <div class="card bg-base-100 shadow-xl border border-base-200">
          <div class="card-body">
            <h3 class="card-title text-primary border-b pb-2 mb-4">📄 المعلومات الأساسية</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><span class="font-bold">عنوان البحث:</span> {{ application.title }}</div>
              <div><span class="font-bold">الباحث الرئيسي:</span> {{ application.student?.full_name || 'N/A' }}</div>
              <div><span class="font-bold">التخصص:</span> {{ application.student?.department || 'N/A' }}</div>
              <div><span class="font-bold">تاريخ التقديم:</span> {{ new Date(application.created_at).toLocaleDateString('ar-EG') }}</div>
            </div>
<!--             
            <div class="mt-4">
              <span class="font-bold block mb-1">📝 ملخص البحث (Abstract):</span>
              <p class="p-4 bg-base-200 rounded-lg text-justify leading-relaxed">{{ application.abstract || 'لا يوجد ملخص متاح.' }}</p>
            </div> -->
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl border border-base-200">
          <div class="card-body">
            <h3 class="card-title text-primary border-b pb-2 mb-4">📁 الملفات والمرفقات</h3>
            <div class="space-y-3">
              <div v-if="application.proposal_path" class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <span>📑 ملف المقترح البحثي (Proposal)</span>
                <a :href="application.proposal_path" target="_blank" class="btn btn-sm btn-outline btn-primary">👁️ معاينة / تحميل</a>
              </div>
              <div v-if="application.final_file_path" class="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <span>📕 ملف البحث النهائي</span>
                <a :href="application.final_file_path" target="_blank" class="btn btn-sm btn-outline btn-primary">👁️ معاينة / تحميل</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="card bg-base-100 shadow-xl border border-base-200 sticky top-6">
          <div class="card-body">
            <h3 class="card-title text-error border-b pb-2 mb-4">⚖️ اتخاذ القرار النهائي</h3>
            
            <div class="form-control w-full mb-4">
              <label class="label"><span class="label-text font-semibold">ملاحظات وتوجيهات المدير:</span></label>
              <textarea 
                v-model="notes" 
                class="textarea textarea-bordered h-28 w-full" 
                placeholder="اكتب هنا أسباب الرفض، أو التعديلات المطلوبة، أو ملحوظات القبول..."
              ></textarea>
            </div>

            <div class="flex flex-col gap-3">
              <button 
                @click="handleDecision('approved')" 
                :disabled="submitting"
                class="btn btn-success text-white w-full gap-2 shadow"
              >
                اعتماد والذهاب لتحديد الرسوم
              </button>

              <button 
                @click="handleDecision('needs_modification')" 
                :disabled="submitting"
                class="btn btn-warning text-white w-full gap-2 shadow"
              >
                طلب تعديل من الباحث
              </button>

              <button 
                @click="handleDecision('rejected')" 
                :disabled="submitting"
                class="btn btn-error text-white w-full gap-2 shadow"
              >
                رفض البحث نهائياً
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
  
  <div v-else class="flex justify-center items-center min-h-screen">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import managerService from '@/services/managerService';
import PageHeader from '@/components/common/PageHeader.vue';

const route = useRoute();
const router = useRouter();
const applicationId = route.params.id;

const application = ref(null);
const notes = ref('');
const submitting = ref(false);

// 1. تحميل بيانات البحث الكاملة عند فتح الصفحة
onMounted(async () => {
  try {
    const result = await managerService.getDecisionDetails(applicationId);
    if (result && result.status === 'success') {
      application.value = result.data;
    }
  } catch (err) {
    console.error('Error fetching application details:', err);
  }
});

// 2. معالجة إرسال القرار بناءً على الزر المضغوط
const handleDecision = async (status) => {
  if ((status === 'rejected' || status === 'needs_modification') && !notes.value.trim()) {
    alert('برجاء كتابة الملاحظات وأسباب القرار للباحث أولاً!');
    return;
  }

  submitting.value = true;
  try {
    const payload = {
      decision: status,
      notes: notes.value
    };

    const response = await managerService.processDecision(applicationId, payload);
    
    if (response && response.status === 'success') {
      // شوفي الـ Action اللي راجع من السيرفر وبناء عليه نعمل الـ Redirect المظبوط
      if (response.action === 'redirect_payment') {
        // 🔥 اللينك اللي طلبتيه بالملي لتحديد الرسوم
        router.push(`/admin/payments/set-fee/${applicationId}`);
      } else {
        // لو رفض أو تعديل، يرجع للداش بورد عادي
        router.push('/manager/dashboard');
      }
    }
  } catch (err) {
    console.error('Error submitting decision:', err);
  } finally {
    submitting.value = false;
  }
};
</script>