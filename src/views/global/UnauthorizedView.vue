<template>
    <div
        class="min-h-screen bg-base-200 flex items-center justify-center p-6 selection:bg-primary selection:text-primary-content">

        <div class="text-center max-w-xl w-full">

            <!-- Icon -->
            <div class="flex justify-center mb-8">
                <div
                    class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
            </div>


            <!-- Heading -->
            <h2 class="text-3xl font-bold text-neutral mb-4 tracking-tight">ليس لديك صلاحية للوصول</h2>
            <p class="text-lg text-base-content/70 mb-10 leading-relaxed px-4">
                لا تملك الصلاحيات الكافية للوصول إلى هذه الصفحة.<br />
                يرجى تسجيل الدخول أو التواصل مع مدير النظام.
            </p>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button @click="goBack"
                    class="btn btn-outline btn-neutral w-full sm:w-auto gap-2 border-base-300 hover:bg-base-300 hover:text-base-content hover:border-base-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    الرجوع للخلف
                </button>

                <RouterLink to="/login"
                    class="btn btn-primary w-full sm:w-auto shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all gap-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    تسجيل الدخول بحساب آخر
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * Navigates the user to the previous page in their browser history.
 */
const goBack = () => {
    router.back()
}
</script>

