<template>
    <div
        class="min-h-screen bg-base-200 flex items-center justify-center p-6 selection:bg-primary selection:text-primary-content">

        <div class="text-center max-w-xl w-full">

            <div class="flex justify-center mb-8">
                <div
                    class="w-16 h-16 bg-error rounded-2xl flex items-center justify-center shadow-xl shadow-error/30">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" 
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" 
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
            </div>

            <h1 class="text-9xl font-black text-neutral/10 drop-shadow-sm mb-2 relative">
                4<span class="text-error opacity-90">0</span>3
                <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-error/20 rounded-full blur-2xl -z-10">
                </div>
            </h1>

            <h2 class="text-3xl font-bold text-neutral mb-4 tracking-tight">وصول غير مصرح به!</h2>
            <p class="text-lg text-base-content/70 mb-10 leading-relaxed px-4">
                عذراً، الحساب الحالي لا يمتلك الصلاحيات الكافية لاستعراض هذه الصفحة ضمن منظومة الموافقات البحثية. 
                يرجى التأكد من تسجيل الدخول بالحساب الصحيح أو العودة للوحة التحكم الخاصة بك.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">

                <button @click="goBack"
                    class="btn btn-outline btn-neutral w-full sm:w-auto gap-2 border-base-300 hover:bg-base-300 hover:text-base-content hover:border-base-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    الرجوع للخلف
                </button>

                <RouterLink to="/dashboard"
                    class="btn btn-primary w-full sm:w-auto shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all gap-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" 
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    العودة للوحة التحكم
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