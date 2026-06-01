<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth/auth.store';

const authStore = useAuthStore();
const router = useRouter();

const isLoading = ref(false);
const errorMessage = ref(null);
const showPass = ref(false);

const idFrontFile = ref(null);
const idBackFile = ref(null);

const form = ref({
    full_name: '',
    email: '',
    national_id: '',
    phone_number: '',
    faculty: '',
    department: '',
    password: '',
    password_confirmation: '',
});

const passMatch = computed(() => {
    if (!form.value.password_confirmation) return null;
    return form.value.password === form.value.password_confirmation;
});

const progress = computed(() => {
    const fields = [
        form.value.full_name, form.value.email, form.value.national_id,
        form.value.phone_number, form.value.faculty, form.value.department,
        form.value.password, form.value.password_confirmation,
        idFrontFile.value, idBackFile.value,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
});

const handleFrontUpload = (e) => (idFrontFile.value = e.target.files[0]);
const handleBackUpload  = (e) => (idBackFile.value  = e.target.files[0]);

const handleRegister = async () => {
    errorMessage.value = null;

    if (!passMatch.value) {
        errorMessage.value = 'كلمتا المرور غير متطابقتين';
        return;
    }
    if (!idFrontFile.value || !idBackFile.value) {
        errorMessage.value = 'يرجى رفع صورتَي بطاقة الهوية';
        return;
    }

    isLoading.value = true;

    const payload = new FormData();
    Object.entries(form.value).forEach(([key, value]) => {
        payload.append(key, value);
    });
    payload.append('id_front', idFrontFile.value);
    payload.append('id_back',  idBackFile.value);

    try {
        await authStore.register(payload);
        if (!authStore.errorMessage) {
            router.push('/login');
        } else {
            errorMessage.value = authStore.errorMessage;
        }
    } catch (err) {
        errorMessage.value = err.message === 'Failed to fetch'
            ? 'تعذّر الاتصال بالخادم، شيك على الـ CORS أو اتصال الشبكة'
            : err.message;
    } finally {
        isLoading.value = false;
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
            <h1 class="text-3xl font-bold text-neutral leading-tight">إنشاء حساب جديد</h1>
            <p class="text-base-content/50 text-sm mt-1">
                سيتم مراجعة بياناتك من قِبَل المسؤول قبل تفعيل الحساب
            </p>

            <div class="mt-5 space-y-1.5">
                <div class="flex justify-between items-center">
                    <span class="text-xs text-base-content/40 font-medium">اكتمال النموذج</span>
                    <span class="text-xs font-bold text-primary">{{ progress }}%</span>
                </div>
                <div class="w-full h-1.5 bg-base-200 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                        :style="{ width: progress + '%' }"
                    ></div>
                </div>
            </div>
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

        <form class="space-y-6" @submit.prevent="handleRegister">

            <div class="flex items-center gap-3">
                <span class="text-[10px] font-black tracking-widest text-base-content/30 uppercase">البيانات الشخصية</span>
                <span class="flex-1 h-px bg-base-200"></span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <fieldset class="fieldset p-0">
                    <legend class="fieldset-legend text-base-content/60 font-semibold mb-1 text-xs">الاسم الكامل</legend>
                    <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <input v-model="form.full_name" type="text" placeholder="محمد أحمد علي"
                            class="grow bg-transparent outline-none text-sm" :disabled="isLoading" required />
                    </label>
                </fieldset>

                <fieldset class="fieldset p-0">
                    <legend class="fieldset-legend text-base-content/60 font-semibold mb-1 text-xs">الرقم القومي</legend>
                    <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                        </svg>
                        <input v-model="form.national_id" type="text" placeholder="299XXXXXXXXXXX"
                            class="grow bg-transparent outline-none text-sm tracking-wider" :disabled="isLoading" dir="ltr" required />
                    </label>
                </fieldset>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <fieldset class="fieldset p-0">
                    <legend class="fieldset-legend text-base-content/60 font-semibold mb-1 text-xs">البريد الإلكتروني</legend>
                    <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <input v-model="form.email" type="email" placeholder="example@university.edu"
                            class="grow bg-transparent outline-none text-sm" :disabled="isLoading" dir="ltr" required />
                    </label>
                </fieldset>

                <fieldset class="fieldset p-0">
                    <legend class="fieldset-legend text-base-content/60 font-semibold mb-1 text-xs">رقم الهاتف</legend>
                    <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <input v-model="form.phone_number" type="tel" placeholder="01xxxxxxxxx"
                            class="grow bg-transparent outline-none text-sm" :disabled="isLoading" dir="ltr" required />
                    </label>
                </fieldset>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <fieldset class="fieldset p-0">
                    <legend class="fieldset-legend text-base-content/60 font-semibold mb-1 text-xs">القسم</legend>
                    <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <input v-model="form.department" type="text" placeholder="الجراحة العامة"
                            class="grow bg-transparent outline-none text-sm" :disabled="isLoading" required />
                    </label>
                </fieldset>
            </div>

            <div class="flex items-center gap-3 pt-1">
                <span class="text-[10px] font-black tracking-widest text-base-content/30 uppercase">كلمة المرور</span>
                <span class="flex-1 h-px bg-base-200"></span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <fieldset class="fieldset p-0">
                    <legend class="fieldset-legend text-base-content/60 font-semibold mb-1 text-xs">كلمة المرور</legend>
                    <label class="input input-bordered w-full flex items-center gap-2 focus-within:input-primary transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-base-content/25 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <input v-model="form.password" :type="showPass ? 'text' : 'password'"
                            placeholder="••••••••" class="grow bg-transparent outline-none text-sm"
                            :disabled="isLoading" dir="ltr" required />
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
                            :disabled="isLoading" dir="ltr" required />
                    </label>
                    <p v-if="passMatch === false" class="text-xs text-error mt-1.5 font-medium">كلمتا المرور غير متطابقتين</p>
                    <p v-if="passMatch === true" class="text-xs text-success mt-1.5 font-medium">كلمتا المرور متطابقتان ✓</p>
                </fieldset>
            </div>

            <div class="flex items-center gap-3 pt-1">
                <span class="text-[10px] font-black tracking-widest text-base-content/30 uppercase">وثائق الهوية</span>
                <span class="flex-1 h-px bg-base-200"></span>
                <span class="text-[10px] text-base-content/30">JPG · PNG · JPEG</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="doc in [
                    { label: 'الوجه الأمامي للبطاقة', key: 'front', handler: handleFrontUpload, file: idFrontFile },
                    { label: 'الوجه الخلفي للبطاقة',  key: 'back',  handler: handleBackUpload,  file: idBackFile  },
                ]" :key="doc.key">
                    <p class="text-xs font-semibold text-base-content/60 mb-2">{{ doc.label }}</p>
                    <label :for="`upload-${doc.key}`"
                        class="group flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200"
                        :class="doc.file
                            ? 'border-primary/50 bg-primary/5'
                            : 'border-base-300 bg-base-200/30 hover:border-primary/30 hover:bg-primary/5'">

                        <template v-if="doc.file">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-primary mb-1.5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="text-xs font-semibold text-primary">تم الرفع بنجاح</span>
                            <span class="text-[10px] text-base-content/40 mt-0.5 max-w-[90%] truncate px-2">
                                {{ doc.file.name }} </span>
                        </template>

                        <template v-else>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="h-7 w-7 text-base-content/20 mb-1.5 group-hover:text-primary/40 transition-colors"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="text-xs font-medium text-base-content/30 group-hover:text-base-content/50 transition-colors">
                                اضغط لرفع الملف
                            </span>
                        </template>

                        <input :id="`upload-${doc.key}`" type="file"
                            accept=".jpg,.jpeg,.png"
                            class="hidden" :disabled="isLoading"
                            @change="doc.handler" />
                    </label>
                </div>
            </div>

            <div class="pt-2 space-y-3">
                <button type="submit"
                    class="btn btn-primary w-full shadow-md shadow-primary/20 transition-all duration-200"
                    :class="progress === 100 ? 'hover:shadow-primary/30' : 'opacity-70'"
                    :disabled="isLoading">
                    <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
                    <svg v-else-if="progress === 100" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ isLoading ? 'جارٍ إنشاء الحساب وتشفير البيانات...' : 'إنشاء الحساب' }}
                </button>

                <p class="text-center text-xs text-base-content/35 pt-1">
                    لديك حساب بالفعل؟
                    <RouterLink to="/login" class="text-primary font-semibold link link-hover">
                        تسجيل الدخول
                    </RouterLink>
                </p>
            </div>

        </form>
    </div>
</template>