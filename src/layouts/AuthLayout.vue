<script setup>
import trackMount from '@/utils/mountTracker';

trackMount("About view")
</script>

<template>
    <div class="min-h-screen flex bg-base-200 lg:bg-base-100">

        <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">

            <div class="absolute top-6 inset-e-6 lg:hidden">
                <RouterLink to="/" class="btn btn-circle btn-ghost btn-sm bg-base-100 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </RouterLink>
            </div>

            <div
                class="w-full max-w-md space-y-8 z-10 bg-base-100 p-8 rounded-box shadow-xl lg:shadow-none lg:bg-transparent lg:p-0">

                <div class="lg:hidden text-center mb-6">
                    <div class="inline-flex items-center justify-center gap-2 mb-2">
                        <span
                            class="w-10 h-10 rounded-xl bg-primary text-primary-content flex items-center justify-center font-bold text-xl shadow-md shadow-primary/20">I</span>
                    </div>
                    <h2 class="text-2xl font-bold text-neutral">تسجيل الدخول</h2>
                </div>

                <slot></slot>

            </div>
        </div>

        <div class="hidden lg:flex w-1/2 bg-neutral relative items-center justify-center overflow-hidden">
            <div class="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>

            <div class="z-10 text-center max-w-lg p-8">
                <div class="flex justify-center mb-8">
                    <span
                        class="w-24 h-24 rounded-2xl bg-primary text-primary-content flex items-center justify-center font-black text-5xl shadow-xl shadow-primary/30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">I</span>
                </div>
                <h3 class="text-4xl font-bold text-white mb-6 leading-tight">منظومة الموافقات البحثية</h3>
                <p class="text-lg text-neutral-content/80 leading-relaxed">
                    منصة رقمية متكاملة تضمن لك سير عمل سريع، تقييم موثوق، وحماية تامة لبيانات مشاريعك البحثية ولجان
                    المراجعة.
                </p>
            </div>

            <div class="absolute -bottom-10 -inset-s-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div class="absolute -top-10 -inset-e-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>

    </div>
</template>