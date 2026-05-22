<script setup>
import trackMount from '@/utils/mountTracker';

trackMount("About view")
</script>

<template>
    <div class="min-h-screen flex flex-col bg-base-100 selection:bg-primary selection:text-primary-content">

        <header class="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-base-200 px-4 md:px-8">
            <div class="flex-1">
                <RouterLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span
                        class="w-8 h-8 rounded-lg bg-primary text-primary-content flex items-center justify-center font-bold shadow-sm shadow-primary/30">I</span>
                    <span class="font-bold text-xl text-neutral">IRB Platform</span>
                </RouterLink>
            </div>

            <div class="flex-none hidden md:flex gap-4 items-center">
                <ul class="menu menu-horizontal px-1 font-medium text-base-content/80">
                    <li>
                        <RouterLink to="/" active-class="text-primary font-bold bg-base-200/50">الرئيسية</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/about" active-class="text-primary font-bold bg-base-200/50">عن النظام
                        </RouterLink>
                    </li>
                </ul>
                <RouterLink to="/login"
                    class="btn btn-primary px-6 text-primary-content shadow-sm hover:shadow-md transition-all">تسجيل
                    الدخول</RouterLink>
            </div>

            <div class="flex-none md:hidden">
                <div class="dropdown dropdown-end">
                    <label tabindex="0" class="btn btn-ghost btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </label>
                    <ul tabindex="0"
                        class="menu menu-sm dropdown-content mt-3 z-1 p-3 shadow-lg bg-base-100 border border-base-200 rounded-box w-52 gap-1">
                        <li>
                            <RouterLink to="/" active-class="bg-base-200 text-primary">الرئيسية</RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/about" active-class="bg-base-200 text-primary">عن النظام</RouterLink>
                        </li>
                        <div class="divider my-1"></div>
                        <li>
                            <RouterLink to="/login" class="btn btn-primary btn-sm text-primary-content mt-1">تسجيل
                                الدخول</RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </header>

        <main class="grow flex flex-col">
            <slot></slot>
        </main>

        <footer class="footer bg-neutral text-neutral-content p-10">
            <aside>
                <div class="flex items-center gap-2 mb-2">
                    <span
                        class="w-10 h-10 rounded bg-primary text-primary-content flex items-center justify-center font-bold text-xl">I</span>
                    <span class="font-bold text-2xl text-white tracking-wide">IRB</span>
                </div>
                <p class="text-neutral-content/80">منظومة الموافقات البحثية الرقمية<br />جميع الحقوق محفوظة © 2026</p>
            </aside>
            <nav>
                <h6 class="footer-title text-white">روابط سريعة</h6>
                <RouterLink to="/about" class="link link-hover text-neutral-content/80">دليل الاستخدام</RouterLink>
                <a href="#" class="link link-hover text-neutral-content/80">الشروط والأحكام</a>
                <a href="#" class="link link-hover text-neutral-content/80">الدعم الفني</a>
            </nav>
        </footer>

    </div>
</template>