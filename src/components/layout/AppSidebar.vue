<template>
    <aside
        class="flex flex-col bg-neutral text-neutral-content h-full transition-all duration-300 ease-in-out border-l border-white/5 shadow-2xl lg:shadow-none z-50"
        :class="isExpanded ? 'w-65' : 'w-24'">
        <div class="h-24 flex items-center transition-all border-b border-white/5"
            :class="isExpanded ? 'px-6 justify-start' : 'px-0 justify-center'">
            <div @click="$emit('toggle')" class="flex items-center gap-3 cursor-pointer group">
                <div
                    class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 group-hover:opacity-90 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>

                <div v-if="isExpanded" class="flex flex-col whitespace-nowrap overflow-hidden">
                    <h1 class="text-2xl font-bold text-white leading-none tracking-wide">IRB</h1>
                    <p class="text-[10px] text-neutral-content/70 mt-1">منظومة الموافقات البحثية</p>
                </div>
            </div>
        </div>

        <div class="flex-1 py-6 px-3 flex flex-col gap-2" :class="isExpanded ? 'overflow-y-auto' : 'overflow-visible'">
            <div v-for="link in navLinks" :key="link.id" class="w-full flex">

                <div :class="[!isExpanded ? 'tooltip tooltip-left' : '', 'w-full']" :data-tip="link.label">
                    <RouterLink :to="link.route"
                        class="flex items-center rounded-2xl transition-all duration-200 group relative" :class="[
                            isExpanded ? 'px-4 py-3 gap-4 justify-start' : 'justify-center w-14 h-14 mx-auto',
                            'hover:bg-white/5 text-neutral-content hover:text-white'
                        ]" active-class="bg-white/10 text-white shadow-inner">
                        <div class="relative flex items-center justify-center shrink-0">
                            <span v-html="link.icon"
                                class="w-6 h-6 flex items-center justify-center *:w-full *:h-full"></span>

                            <span v-if="link.badge && !isExpanded"
                                class="absolute -top-1 -left-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center shadow-sm">
                                {{ link.badge }}
                            </span>
                        </div>

                        <span v-if="isExpanded" class="flex-1 whitespace-nowrap text-start text-sm font-medium">
                            {{ link.label }}
                        </span>

                        <span v-if="link.badge && isExpanded"
                            class="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                            {{ link.badge }}
                        </span>
                    </RouterLink>
                </div>

            </div>
        </div>

        <div class="p-4 border-t border-white/5 mt-auto">
            <div :class="[!isExpanded ? 'tooltip tooltip-left w-full' : 'w-full']" data-tip="تسجيل الخروج">
                <button
                    class="flex items-center w-full rounded-2xl transition-all duration-200 hover:bg-error/20 hover:text-error text-neutral-content/80 group"
                    :class="isExpanded ? 'px-4 py-3 gap-4 justify-start' : 'justify-center w-14 h-14 mx-auto'" 
                    :disabled="authStore.loading" 
                    @click="handleLogout">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                    <span v-if="isExpanded" class="whitespace-nowrap text-sm font-medium">تسجيل الخروج</span>
                </button>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth/auth.store'

const props = defineProps({
    isExpanded: {
        type: Boolean,
        default: true
    }
})

defineEmits(['toggle'])

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
    localStorage.removeItem('pending_client_secret');
    await authStore.logout();
    router.push('/login');
}

// Read user role from authStore computed userRole
const role = computed(() => authStore.userRole || 'student')

const navLinks = computed(() => {
    let links = [
        {
            id: 'dashboard',
            label: 'لوحة التحكم',
            route: '/dashboard',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>`
        }
    ];

    if (role.value === 'student') {
        links = [];
        links.push({
            id: 'student/dashboard',
            label: 'لوحة التحكم',
            route: '/student/dashboard',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`
        });
        links.push({
            id: 'new-application',
            label: 'تقديم بحث جديد',
            route: '/student/new-application',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>`
        });
        links.push({
            id: 'my-researches',
            label: 'أبحاثي',
            route: '/student/my-researches',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>`
        });
        links.push({
            id: 'pending-payments',
            label: 'المدفوعات المعلقة',
            route: '/student/payments/pending',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>`
        });
        links.push({
            id: 'payment-history',
            label: 'سجل المدفوعات',
            route: '/student/payments/history',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`
        });
    } 
    else if (role.value === 'manager') {
        links.push({
            id: 'manager/statistics',
            label: 'الأحصائيات',
            route: '/manager/statistics',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>`
        });
        links.push({
            id: 'manager/dashboard',
            label: 'أبحاث جاهزة للأعتماد النهائي',
            route: '/manager/dashboard',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>`
        });
        links.push({
            id: 'manager/final-approvals',
            label: 'سجل الاعتمادات النهائية',
            route: '/manager/final-approvals',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`
        });
        links.push({
            id: 'admin-payments',
            label: 'إدارة المدفوعات',
            route: '/admin/payments',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" /></svg>`
        });
        links.push({
            id: 'logs',
            label: 'سجل النشاطات',
            route: '/logs',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`
        });
    } 
    
    else if (role.value === 'admin') {
        links.push({
            id: 'dashboard',
            label: 'لوحة التحكم',
            route: '/dashboard',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>`
        });
        links.push({
            id: 'admin-payments',
            label: 'إدارة المدفوعات',
            route: '/admin/payments',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" /></svg>`
        });
        links.push({
            id: 'logs',
            label: 'سجل النشاطات',
            route: '/logs',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`
        });
    }

    links.push({
        id: 'notifications',
        label: 'الإشعارات',
        route: '/notifications',
        badge: 8,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>`
    });

    return links;
});
</script>