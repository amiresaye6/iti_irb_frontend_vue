<script setup>
import { ref, onMounted } from 'vue';
import PageHeader from '@/components/common/PageHeader.vue';
import Spinner    from '@/components/common/Spinner.vue';
import { useAuthStore } from '@/store/auth/auth.store';
import { updateProfile } from '@/services/authService';
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
const authStore = useAuthStore();

const isLoading    = ref(false);
const isSaving     = ref(false);
const errorMessage = ref(null);
const successMsg   = ref(null);

const setLoading = (val) => (isLoading.value = val);
const setError   = (err) => (errorMessage.value = err ? (err.message || err) : null);

const form = ref({
    phone_number: '',
    faculty:      '',
    department:   '',
});

onMounted(() => {
    if (authStore.user) {
        form.value.phone_number = authStore.user.phone_number ?? '';
        form.value.faculty      = authStore.user.faculty      ?? '';
        form.value.department   = authStore.user.department   ?? '';
    }
});

const handleSave = async () => {
    errorMessage.value = null;
    successMsg.value   = null;
    isSaving.value     = true;

    const res = await updateProfile({
        data: form.value,
        setLoading: (v) => (isSaving.value = v),
        setError,
    });

    if (res) {
        await authStore.fetchProfile();
        successMsg.value = 'تم حفظ التغييرات بنجاح';
        setTimeout(() => (successMsg.value = null), 4000);
    }
};
</script>

<template>
    <div class="p-4 md:p-6 space-y-2 max-w-3xl mx-auto">

        <PageHeader
            title="الملف الشخصي"
            note="يمكنك تعديل بيانات التواصل والكلية والقسم فقط"
        >
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </template>
        </PageHeader>

        <!-- Loading skeleton -->
        <div v-if="isLoading" class="flex justify-center py-20">
            <Spinner />
        </div>

        <template v-else>

            <!-- ── Identity Card (read-only) ──────────────── -->
            <div class="bg-base-100 rounded-2xl shadow-sm border border-base-200/60 overflow-hidden">

                <!-- Card Header -->
                <div class="px-6 py-4 border-b border-base-200/60 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-sm font-bold text-base-content">البيانات المحمية</h2>
                        <p class="text-xs text-base-content/40">لا يمكن تعديلها — تتطلب تدخل المسؤول</p>
                    </div>
                    <div class="ms-auto">
                        <span class="badge badge-ghost badge-sm">للقراءة فقط</span>
                    </div>
                </div>

                <!-- Read-only fields grid -->
                <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    <div v-for="field in [
                        { label: 'الاسم الكامل',    value: authStore.user?.full_name,        icon: 'user'  },
                        { label: 'البريد الإلكتروني', value: authStore.user?.email,      icon: 'email' },
                        { label: 'الرقم القومي',    value: authStore.user?.national_id,  icon: 'id'    },
                        { label: 'الدور الوظيفي',   value: authStore.user?.role,         icon: 'role'  },
        
                    ]" :key="field.label" class="flex flex-col gap-1.5">
                        <span class="text-xs font-semibold text-base-content/40 uppercase tracking-wide">
                            {{ field.label }}
                        </span>
                        <div class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-base-200/50 border border-base-200/60">
                            <!-- Icons -->
                            <svg v-if="field.icon === 'user'" xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 text-base-content/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <svg v-if="field.icon === 'email'" xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 text-base-content/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <svg v-if="field.icon === 'id'" xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 text-base-content/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                            </svg>
                            <svg v-if="field.icon === 'role'" xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 text-base-content/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <span class="text-sm text-base-content/60 font-medium" dir="ltr">
                                {{ field.value ?? '—' }}
                            </span>
                        </div>
                    </div>
                    <div v-for="doc in [
                        { label: 'الهوية — الوجه الأمامي', url: authStore.user?.id_front_url },
                        { label: 'الهوية — الوجه الخلفي',  url: authStore.user?.id_back_url  },
                    ]" :key="doc.label" class="flex flex-col gap-2">
                        <span class="text-xs font-semibold text-base-content/40 uppercase tracking-wide">
                            {{ doc.label }}
                        </span>
                        <div class="rounded-xl overflow-hidden border border-base-200/60 bg-base-200/40 aspect-video flex items-center justify-center">
                            <img
                                v-if="doc.url"
                                :src="IMAGE_BASE_URL + doc.url"
                                :alt="doc.label"
                                class="w-full h-full object-cover"
                            />
                            <div v-else class="flex flex-col items-center gap-2 text-base-content/20">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span class="text-xs">لا توجد صورة</span>
                            </div>
                        </div>
                    </div>
                </div>
                  </div>
                    
                     
            <!-- ── Editable Fields Card ───────────────────── -->
            <div class="bg-base-100 rounded-2xl shadow-sm border border-base-200/60 overflow-hidden">

                <!-- Card Header -->
                <div class="px-6 py-4 border-b border-base-200/60 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-sm font-bold text-base-content">البيانات القابلة للتعديل</h2>
                        <p class="text-xs text-base-content/40">يمكنك تحديث هذه المعلومات في أي وقت</p>
                    </div>
                </div>

                <!-- Alerts inside card -->
                <div class="px-6 pt-5 space-y-3">
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

                <!-- Editable Form -->
                <form class="p-6 space-y-5" @submit.prevent="handleSave">

                    <!-- Phone -->
                    <fieldset class="fieldset w-full p-0">
                        <legend class="fieldset-legend text-base-content/70 font-medium mb-1">
                            رقم الهاتف
                        </legend>
                        <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/30 shrink-0"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <input
                                v-model="form.phone_number"
                                type="tel"
                                placeholder="01xxxxxxxxx"
                                class="grow bg-transparent outline-none text-sm"
                                :disabled="isSaving"
                                dir="ltr"
                            />
                        </label>
                    </fieldset>

                    <!-- Faculty -->
                    <fieldset class="fieldset w-full p-0">
                        <legend class="fieldset-legend text-base-content/70 font-medium mb-1">
                            الكلية
                        </legend>
                        <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/30 shrink-0"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                            <input
                                v-model="form.faculty"
                                type="text"
                                placeholder="مثال: كلية الطب"
                                class="grow bg-transparent outline-none text-sm"
                                :disabled="isSaving"
                            />
                        </label>
                    </fieldset>

                    <!-- Department -->
                    <fieldset class="fieldset w-full p-0">
                        <legend class="fieldset-legend text-base-content/70 font-medium mb-1">
                            القسم
                        </legend>
                        <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/30 shrink-0"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <input
                                v-model="form.department"
                                type="text"
                                placeholder="مثال: قسم الجراحة"
                                class="grow bg-transparent outline-none text-sm"
                                :disabled="isSaving"
                            />
                        </label>
                    </fieldset>

                    <!-- Submit -->
                    <div class="pt-2 flex justify-end">
                        <button
                            type="submit"
                            class="btn btn-primary gap-2 min-w-36"
                            :disabled="isSaving"
                        >
                            <span v-if="isSaving" class="loading loading-spinner loading-sm"></span>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            {{ isSaving ? 'جارٍ الحفظ...' : 'حفظ التغييرات' }}
                        </button>
                    </div>

                </form>
            </div>

        </template>
    </div>
</template>
