<!-- this is a temp page, not a functional one, if you have to delete it , tell me first and do it  -->



<template>
    <form @submit.prevent="handleLogin" class="flex flex-col gap-4 text-start">
        <!-- Email Input -->
        <fieldset class="fieldset w-full">
            <legend class="fieldset-legend">البريد الإلكتروني</legend>
            <input type="email" placeholder="أدخل إيميلك هنا..." class="input input-bordered w-full" />
        </fieldset>

        <!-- Password Input -->
        <fieldset class="fieldset w-full">
            <legend class="fieldset-legend">كلمة المرور</legend>
            <input type="password" placeholder="••••••••" class="input input-bordered w-full" />
            <div class="fieldset-label text-end mt-1">
                <a href="#" class="link link-hover text-sm text-primary">نسيت كلمة المرور؟</a>
            </div>
        </fieldset>

        <!-- Actions -->
        <div class="mt-4">
            <RouterLink to="/dashboard" class="btn btn-primary w-full">دخول للنظام</RouterLink>
        </div>

        <div class="divider text-sm">أو</div>

        <button type="button" class="btn btn-outline btn-secondary w-full">
            تسجيل باحث جديد
        </button>
    </form>
</template>

<script setup>
const handleLogin = () => {
    console.log('Login submitted')
}
</script>