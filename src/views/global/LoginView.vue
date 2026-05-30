<!-- this is a temp page, not a functional one, if you have to delete it , tell me first and do it  -->

<template>
    <form @submit.prevent="handleLogin" class="flex flex-col gap-4 text-start">
        <div v-if="error" class="alert alert-error text-sm rounded-lg p-3">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>{{ error.message || 'فشل في تسجيل الدخول. تأكد من صحة بياناتك.' }}</span>
        </div>

        <!-- Email Input -->
        <fieldset class="fieldset w-full">
            <legend class="fieldset-legend">البريد الإلكتروني</legend>
            <input type="email" v-model="form.email" required placeholder="أدخل إيميلك هنا..." class="input input-bordered w-full" :disabled="isLoading" />
        </fieldset>

        <!-- Password Input -->
        <fieldset class="fieldset w-full">
            <legend class="fieldset-legend">كلمة المرور</legend>
            <input type="password" v-model="form.password" required placeholder="••••••••" class="input input-bordered w-full" :disabled="isLoading" />
            <div class="fieldset-label text-end mt-1">
                <a href="#" class="link link-hover text-sm text-primary">نسيت كلمة المرور؟</a>
            </div>
        </fieldset>

        <!-- Actions -->
        <div class="mt-4">
            <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
                <span v-if="isLoading" class="loading loading-spinner"></span>
                <span v-else>دخول للنظام</span>
            </button>
        </div>

        <div class="divider text-sm">أو</div>

        <button type="button" class="btn btn-outline btn-secondary w-full" :disabled="isLoading">
            تسجيل باحث جديد
        </button>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authServices } from '@/services/authServices';

const router = useRouter();
const { login } = authServices();

const form = ref({
    email: '',
    password: ''
});

const isLoading = ref(false);
const error = ref(null);

const handleLogin = async () => {
    error.value = null;
    const res = await login(
        form.value,
        (loading) => isLoading.value = loading,
        (err) => {
            if (err) error.value = err;
        }
    );

    if (res && res.status && res.token) {
        // Save the token to localStorage
        localStorage.setItem('token', res.token);
        
        // Save user data
        if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
        }

        // Redirect based on user role
        router.push('/dashboard');
    } else if (res && !res.status) {
        error.value = new Error(res.message || 'فشل في تسجيل الدخول');
    }
};
</script>