<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { resetPassword } from '@/services/authService';

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);
const showPass = ref(false);

const token = ref('');
const email = ref('');

const form = ref({
    password: '',
    password_confirmation: '',
});

const passMatch = computed(() => {
    if (!form.value.password_confirmation) return null;
    return form.value.password === form.value.password_confirmation;
});

const linkInvalid = computed(() => !token.value || !email.value);

onMounted(() => {
    token.value = route.query.token || '';
    email.value = route.query.email || '';

    if (linkInvalid.value) {
        errorMessage.value = 'رابط إعادة تعيين كلمة المرور غير صالح أو غير مكتمل.';
    }
});

const handleReset = async () => {
    errorMessage.value = null;
    successMessage.value = null;

    if (linkInvalid.value) {
        errorMessage.value = 'رابط إعادة تعيين كلمة المرور غير صالح.';
        return;
    }

    if (!passMatch.value) {
        errorMessage.value = 'كلمتا المرور غير متطابقتين';
        return;
    }

    try {
        const result = await resetPassword({
            data: {
                token: token.value,
                email: email.value,
                password: form.value.password,
                password_confirmation: form.value.password_confirmation,
            },
            setLoading: (v) => (isLoading.value = v),
            setError: (e) => (errorMessage.value = e),
        });

        if (!errorMessage.value) {
            successMessage.value = result?.message || 'تم تغيير كلمة المرور بنجاح.';
            setTimeout(() => router.push('/login'), 2000);
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
            <h1 class="text-3xl font-bold text-neutral leading-tight">إعادة تعيين كلمة المرور</h1>
            <p class="text-base-content/50 text-sm mt-1">
                أدخل كلمة المرور الجديدة الخاصة بحسابك
            </p>
            <p v-if="email" class="text-base-content/40 text-xs mt-1" dir="ltr">{{ email }}</p>
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

        <form v-if="!linkInvalid && !successMessage" class="space-y-6" @submit.prevent="handleReset">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <fieldset class="fieldset p-0">
                    <legend class="fieldset-legend text-base-content/60 font-semibold mb-1 text-xs">كلمة المرور الجديدة</legend>
                    <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <input v-model="form.password" :type="showPass ? 'text' : 'password'"
                            placeholder="••••••••" class="grow bg-transparent outline-none text-sm"
                            :disabled="isLoading" dir="ltr" required minlength="8" />
                        <button type="button"
                            class="text-base-content/25 hover:text-primary transition-colors cursor-pointer"
                            @click="showPass = !showPass">
                            <svg v-if="showPass" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </label>
                </fieldset>

                <fieldset class="fieldset p-0">
                    <legend class="fieldset-legend text-base-content/60 font-semibold mb-1 text-xs">تأكيد كلمة المرور</legend>
                    <label class="input input-bordered w-full flex items-center gap-2 transition-all duration-200"
                        :class="{
                            'input-error':   passMatch === false,
                            'input-success': passMatch === true,
                            'focus-within:input-primary': passMatch === null
                        }">
                        <svg v-if="passMatch === true" xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-else-if="passMatch === false" xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-error shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-base-content/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <input v-model="form.password_confirmation"
                            :type="showPass ? 'text' : 'password'"
                            placeholder="••••••••"
                            class="grow bg-transparent outline-none text-sm"
                            :disabled="isLoading" dir="ltr" required minlength="8" />
                    </label>
                    <p v-if="passMatch === false" class="text-xs text-error mt-1.5 font-medium">كلمتا المرور غير متطابقتين</p>
                    <p v-if="passMatch === true" class="text-xs text-success mt-1.5 font-medium">كلمتا المرور متطابقتان ✓</p>
                </fieldset>
            </div>

            <button type="submit"
                class="btn btn-primary w-full shadow-md shadow-primary/20 transition-all duration-200"
                :disabled="isLoading">
                <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
                {{ isLoading ? 'جارٍ تحديث كلمة المرور...' : 'تحديث كلمة المرور' }}
            </button>
        </form>

        <div v-if="linkInvalid" class="text-center">
            <RouterLink to="/forgot-password" class="text-primary font-semibold link link-hover text-sm">
                طلب رابط جديد لإعادة تعيين كلمة المرور
            </RouterLink>
        </div>

        <p v-if="!linkInvalid" class="text-center text-xs text-base-content/35 pt-1">
            تذكرت كلمة المرور؟
            <RouterLink to="/login" class="text-primary font-semibold link link-hover">
                تسجيل الدخول
            </RouterLink>
        </p>

    </div>
</template>