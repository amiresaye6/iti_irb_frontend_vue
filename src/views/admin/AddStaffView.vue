<script setup>
import { ref } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import { addStaff } from '@/services/authService';

const isLoading    = ref(false);
const errorMessage = ref(null);
const successMsg   = ref(null);
const showPass     = ref(false);

const setLoading = (v)   => (isLoading.value = v);
const setError   = (err) => (errorMessage.value = err ? (err.message || err) : null);

const form = ref({
    full_name:       '',
    national_id:  '',
    email:      '',
    phone_number:      '',
    role:       'reviewer',
    faculty: '',
    password:   '',
    password_confirmation: '',
});

const handleSubmit = async () => {
    errorMessage.value = null;
    successMsg.value   = null;

    if (form.value.password !== form.value.password_confirmation) {
        errorMessage.value = 'كلمتا المرور غير متطابقتين';
        return;
    }

    const res = await addStaff({ data: form.value, setLoading, setError });

    if (res) {
        successMsg.value = `تم إضافة ${form.value.full_name} بنجاح كـ ${roleLabel(form.value.role)}`;
        form.value = { full_name: '', email: '', phone_number: '', role: 'reviewer', password: '', password_confirmation: '' };
        setTimeout(() => (successMsg.value = null), 5000);
    }
};

const roleLabel = (role) => ({
    reviewer: 'مراجع',
    manager:  'مدير',
    admin:    'مسؤول',
}[role] ?? role);
</script>

<template>
    <div class="p-4 md:p-6 space-y-2 max-w-2xl mx-auto">

        <PageHeader
            title="إضافة موظف جديد"
            note="أضف مراجعين أو مديرين أو مسؤولين للمنظومة"
        >
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            </template>
        </PageHeader>

        <div class="bg-base-100 rounded-2xl shadow-sm border border-base-200/60 overflow-hidden">

            <div class="px-6 pt-6 space-y-3">
                <div v-if="errorMessage" role="alert"
                    class="flex items-start gap-3 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 mt-0.5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <span>{{ errorMessage }}</span>
                </div>
                

                <div v-if="successMsg" role="alert"
                    class="flex items-start gap-3 p-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 mt-0.5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ successMsg }}</span>
                </div>
            </div>

            <form class="p-6 space-y-5" @submit.prevent="handleSubmit">

                <!-- Name + Role -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <fieldset class="fieldset p-0">
                        <legend class="fieldset-legend text-base-content/70 font-medium mb-1">الاسم الكامل</legend>
                        <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/30 shrink-0"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <input v-model="form.full_name" type="text" placeholder="اسم الموظف"
                                class="grow bg-transparent outline-none text-sm"
                                :disabled="isLoading" required />
                        </label>
                    </fieldset>

<fieldset class="fieldset p-0">
    <legend class="fieldset-legend text-base-content/70 font-medium mb-1">الرقم القومي</legend>
    <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/30 shrink-0"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
        </svg>
        <input v-model="form.national_id" type="text" placeholder="299XXXXXXXXXXX"
            class="grow bg-transparent outline-none text-sm tracking-wider"
            :disabled="isLoading" dir="ltr" required />
    </label>
</fieldset>
 </div>
                 <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <fieldset class="fieldset p-0">
                        <legend class="fieldset-legend text-base-content/70 font-medium mb-1">الدور الوظيفي</legend>
                        <select v-model="form.role"
                            class="select select-bordered w-full focus:select-primary"
                            :disabled="isLoading">
                            <option value="reviewer">مراجع</option>
                            <option value="manager">مدير</option>
                            <option value="admin">مسؤول نظام</option>
                        </select>
                    </fieldset>
                     <fieldset class="fieldset p-0">
                    <legend class="fieldset-legend text-base-content/60 font-semibold mb-1 text-xs">الكلية</legend>
                    <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                        <input v-model="form.faculty" type="text" placeholder="كلية الطب"
                            class="grow bg-transparent outline-none text-sm" :disabled="isLoading" required />
                    </label>
                </fieldset>
                </div>
                <!-- Email + Phone -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <fieldset class="fieldset p-0">
                        <legend class="fieldset-legend text-base-content/70 font-medium mb-1">البريد الإلكتروني</legend>
                        <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/30 shrink-0"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <input v-model="form.email" type="email" placeholder="staff@irb.edu"
                                class="grow bg-transparent outline-none text-sm"
                                :disabled="isLoading" dir="ltr" required />
                        </label>
                    </fieldset>

                    <fieldset class="fieldset p-0">
                        <legend class="fieldset-legend text-base-content/70 font-medium mb-1">رقم الهاتف</legend>
                        <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/30 shrink-0"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <input v-model="form.phone_number" type="tel" placeholder="01xxxxxxxxx"
                                class="grow bg-transparent outline-none text-sm"
                                :disabled="isLoading" dir="ltr" />
                        </label>
                    </fieldset>
                </div>

                <!-- Password -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <fieldset class="fieldset p-0">
                        <legend class="fieldset-legend text-base-content/70 font-medium mb-1">كلمة المرور</legend>
                        <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/30 shrink-0"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <input v-model="form.password" :type="showPass ? 'text' : 'password'"
                                placeholder="••••••••" class="grow bg-transparent outline-none text-sm"
                                :disabled="isLoading" dir="ltr" required />
                            <button type="button"
                                class="text-base-content/30 hover:text-primary transition-colors cursor-pointer"
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
                        <legend class="fieldset-legend text-base-content/70 font-medium mb-1">تأكيد كلمة المرور</legend>
                        <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all"
                            :class="form.password_confirmation && form.password !== form.password_confirmation ? 'input-error' : ''">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/30 shrink-0"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <input v-model="form.password_confirmation" :type="showPass ? 'text' : 'password'"
                                placeholder="••••••••" class="grow bg-transparent outline-none text-sm"
                                :disabled="isLoading" dir="ltr" required />
                        </label>
                        <p v-if="form.password_confirmation && form.password !== form.password_confirmation"
                            class="text-xs text-error mt-1">كلمتا المرور غير متطابقتين</p>
                    </fieldset>
                </div>

                <div class="pt-2 flex justify-end">
                    <button type="submit"
                        class="btn btn-primary gap-2 min-w-40"
                        :disabled="isLoading">
                        <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 4v16m8-8H4" />
                        </svg>
                        {{ isLoading ? 'جارٍ الإضافة...' : 'إضافة الموظف' }}
                    </button>
                </div>

            </form>
        </div>
    </div>
</template>