<script setup>
import { ref } from 'vue';
import { forgotPassword } from '@/services/authService';

const isLoading = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);

const email = ref('');

const handleSubmit = async () => {
    errorMessage.value = null;
    successMessage.value = null;

    try {
        const result = await forgotPassword({
            data: { email: email.value },
            setLoading: (v) => (isLoading.value = v),
            setError: (e) => (errorMessage.value = e),
        });

        if (!errorMessage.value) {
            successMessage.value = result?.message || 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.';
        }
    } catch (err) {
        errorMessage.value = err.message === 'Failed to fetch'
            ? 'تعذّر الاتصال بالخادم، شيك على الـ CORS أو اتصال الشبكة'
            : err.message;
    }
};
</script>

<template>
    <div class="w-full space-y-7">

        <div>
            <div class="hidden lg:flex items-center gap-2 mb-5">
                <span class="text-[10px] font-black tracking-[0.2em] text-primary uppercase">IRB Portal</span>
                <span class="flex-1 h-px bg-primary/20"></span>
            </div>
            <h1 class="text-3xl font-bold text-neutral leading-tight">نسيت كلمة المرور؟</h1>
            <p class="text-base-content/50 text-sm mt-1">
                أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
            </p>
        </div>

        <div v-if="errorMessage" role="alert"
            class="flex items-start gap-3 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mt-0.5 shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
        </div>

        <div v-if="successMessage" role="alert"
            class="flex items-start gap-3 p-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mt-0.5 shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ successMessage }}</span>
        </div>

        <form v-if="!successMessage" class="space-y-6" @submit.prevent="handleSubmit">
            <fieldset class="fieldset p-0">
                <legend class="fieldset-legend text-base-content/60 font-semibold mb-1 text-xs">البريد الإلكتروني</legend>
                <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input v-model="email" type="email" placeholder="example@university.edu"
                        class="grow bg-transparent outline-none text-sm" :disabled="isLoading" dir="ltr" required />
                </label>
            </fieldset>

            <button type="submit"
                class="btn btn-primary w-full shadow-md shadow-primary/20 transition-all duration-200"
                :disabled="isLoading">
                <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
                {{ isLoading ? 'جارٍ الإرسال...' : 'إرسال رابط إعادة التعيين' }}
            </button>
        </form>

        <p class="text-center text-xs text-base-content/35 pt-1">
            تذكرت كلمة المرور؟
            <RouterLink to="/login" class="text-primary font-semibold link link-hover">
                تسجيل الدخول
            </RouterLink>
        </p>

    </div>
</template>