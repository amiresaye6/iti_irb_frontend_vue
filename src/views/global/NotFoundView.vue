<template>
    <div
        class="min-h-screen bg-base-200 flex items-center justify-center p-6 selection:bg-primary selection:text-primary-content">

        <div class="text-center max-w-xl w-full">

            <div class="flex justify-center mb-8">
                <div
                    class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fill-rule="evenodd"
                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
            </div>

            <h1 class="text-9xl font-black text-neutral/10 drop-shadow-sm mb-2 relative">
                4<span class="text-primary opacity-90">0</span>4
                <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary/20 rounded-full blur-2xl -z-10">
                </div>
            </h1>

            <h2 class="text-3xl font-bold text-neutral mb-4 tracking-tight">عذراً، الصفحة غير موجودة!</h2>
            <p class="text-lg text-base-content/70 mb-10 leading-relaxed px-4">
                يبدو أنك ضللت الطريق. الصفحة التي تبحث عنها في منظومة الموافقات البحثية غير متوفرة، ربما تم نقلها،
                حذفها، أو أن الرابط غير صحيح.
            </p>

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

                <RouterLink to="/dashboard"
                    class="btn btn-primary w-full sm:w-auto shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all gap-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
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