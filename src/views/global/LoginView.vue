<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth/auth.store';

const router    = useRouter();
const authStore = useAuthStore();

const form = ref({
    email: '',
    password: '',
});

const showPassword = ref(false);

const ROLE_ROUTES = {
    admin:    '/admin/pending-students',
    super_admin: '/admin/users',
    student:  '/student/Dashboard',
    reviewer: '/reviewer/Dashboard',
    manager:  '/manager/Dashboard',
};

const handleLogin = async () => {
    const role = await authStore.login(form.value);
    if (role) {
        const target = ROLE_ROUTES[role] ?? '/403';
        router.push(target);
    }
};
</script>

<template>
    <div class="w-full space-y-8">

        <!-- Brand + Heading -->
        <div class="space-y-1">
            <div class="flex items-center gap-3 mb-4">
                <span
                    class="w-10 h-10 rounded-xl bg-primary text-primary-content flex items-center justify-center font-black text-lg shadow-md shadow-primary/20 hidden lg:flex">
                    I
                </span>
                <span class="text-xs font-semibold tracking-widest text-primary uppercase hidden lg:block">
                    IRB Portal
                </span>
            </div>
            <h1 class="text-3xl font-bold text-neutral leading-tight">
                مرحباً بعودتك
            </h1>
            <p class="text-base-content/50 text-sm">
                سجّل دخولك للوصول إلى لوحة التحكم الخاصة بك
            </p>
        </div>

        <!-- Error Alert -->
        <div
            v-if="authStore.errorMessage"
            role="alert"
            class="flex items-start gap-3 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mt-0.5 shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span>{{ authStore.errorMessage }}</span>
        </div>

        <!-- Form -->
        <form class="space-y-5" @submit.prevent="handleLogin">

            <!-- Email -->
            <fieldset class="fieldset w-full p-0">
                <legend class="fieldset-legend text-base-content/70 font-medium mb-1">
                    البريد الإلكتروني
                </legend>
                <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/30 shrink-0" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <input
                        v-model="form.email"
                        type="email"
                        placeholder="example@university.edu"
                        class="grow bg-transparent outline-none text-sm"
                        :disabled="authStore.loading"
                        dir="ltr"
                        required
                    />
                </label>
            </fieldset>

            <!-- Password -->
            <fieldset class="fieldset w-full p-0">
                <legend class="fieldset-legend text-base-content/70 font-medium mb-1">
                    كلمة المرور
                </legend>
                <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/30 shrink-0" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="••••••••"
                        class="grow bg-transparent outline-none text-sm"
                        :disabled="authStore.loading"
                        dir="ltr"
                        required
                    />
                    <button
                        type="button"
                        class="text-base-content/30 hover:text-primary transition-colors cursor-pointer"
                        :aria-label="showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
                        @click="showPassword = !showPassword"
                    >
                        <!-- Eye open -->
                        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                        </svg>
                        <!-- Eye closed -->
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </label>

                <!-- Forgot password -->
                <!-- <div class="fieldset-label justify-end mt-2">
                    <RouterLink
                        to="/forgot-password"
                        class="text-xs text-primary hover:text-secondary transition-colors link link-hover"
                    >
                        نسيت كلمة المرور؟
                    </RouterLink>
                </div> -->
            </fieldset>

            <!-- Submit -->
            <div class="pt-2 space-y-3">
                <button
                    type="submit"
                    class="btn btn-primary w-full shadow-md shadow-primary/20 hover:shadow-primary/30 transition-shadow"
                    :disabled="authStore.loading || !form.email || !form.password"
                >
                    <span v-if="authStore.loading" class="loading loading-spinner loading-sm"></span>
                    <span>{{ authStore.loading ? 'جارٍ تسجيل الدخول...' : 'دخول للنظام' }}</span>
                </button>

                <p class="text-center text-xs text-base-content/35 pt-1">
                    لا تملك حساباً؟
                    <!-- <span class="text-base-content/50 font-medium" v-on:click="">امتلك حسابا الان</span> -->
                     <RouterLink
                        to="/register"
                        class="text-xs text-primary hover:text-secondary transition-colors link link-hover"
                    >
                        امتلك حساباً الآن
                    </RouterLink>
                </p>
            </div>

        </form>

    </div>
</template>
