<!-- <template>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth/auth.store'
import { useNotificationStore } from '@/store/notifications'

const props = defineProps({
    isExpanded: {
        type: Boolean,
        default: true
    }
})

defineEmits(['toggle'])

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

onMounted(() => {
    if (authStore.token) {
        notificationStore.fetchNotifications()
    }
})

const handleLogout = async () => {
    localStorage.removeItem('pending_client_secret');
    await authStore.logout();
    router.push('/login');
}

// Read user role from authStore computed userRole
const role = computed(() => authStore.userRole || 'student')

const navLinks = computed(() => {
    let links = [];

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
    } else if (role.value === 'admin') {
        links.push({
            id: 'admin-payments',
            label: 'إدارة المدفوعات',
            route: '/admin/payments',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" /></svg>`
        });
        links.push({
            id: 'admin-users',
            label: 'إدارة المستخدمين',
            route: '/admin/users',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20h5v-2a3 3 0 00-5.356-1.857M7 20H6a3 3 0 010-6h5a3 3 0 013 3v1a3 3 0 01-3 3zM16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
        });
        links.push({
            id: 'assign-reviewers',
            label: 'تعيين المراجعين',
            route: '/admin/assign-reviewer',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>`
        });
        links.push({
            id: 'pending-students',
            label: 'الموافقة على الطلاب',
            route: '/admin/pending-students',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`
        });
        links.push({
            id: 'add-staff',
            label: 'إضافة موظف',
            route: '/admin/add-staff',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>`
        });
        
        links.push({
            id: 'logs',
            label: 'سجل النشاطات',
            route: '/logs',
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
    
    
    else if (role.value === 'super_admin') {
        links.push({
            id: 'admin-users',
            label: 'إدارة المستخدمين',
            route: '/admin/users',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20h5v-2a3 3 0 00-5.356-1.857M7 20H6a3 3 0 010-6h5a3 3 0 013 3v1a3 3 0 01-3 3zM16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
        });
        links.push({
            id: 'pending-students',
            label: 'الموافقة على الطلاب',
            route: '/admin/pending-students',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`
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
    } else if (role.value === 'reviewer') {
        links.push({
            id: 'reviewer-dashboard',
            label: 'لوحة التحكم',
            route: '/reviewer/dashboard',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>`
        });
        links.push({
            id: 'reviewer-pending',
            label: 'مهام جديدة',
            route: '/reviewer/pending',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`
        });
        links.push({
            id: 'reviewer-active',
            label: 'أبحاث قيد المراجعة',
            route: '/reviewer/active',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>`
        });
        links.push({
            id: 'reviewer-history',
            label: 'سجل المراجعات',
            route: '/reviewer/history',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`
        });
    }

    links.push({
        id: 'notifications',
        label: 'الإشعارات',
        route: '/notifications',
        badge: notificationStore.unreadCount,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>`
    });

    return links;
});
</script> -->

<template>
    <aside
        class="flex flex-col bg-neutral text-neutral-content h-full transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none z-50"
        :class="isExpanded ? 'w-65' : 'w-24'"
        style="border-right: 3px solid #1abc9c;">

        <!-- ── Header / Logo ─────────────────────────────────────── -->
        <div class="h-27 flex items-center transition-all border-b border-white/5"
            :class="isExpanded ? 'px-6 justify-start' : 'px-0 justify-center'"
            style="background: linear-gradient(135deg, rgba(26,188,156,0.1) 0%, transparent 100%); border-bottom: 2px solid rgba(26,188,156,0.3) !important;">

            <div @click="$emit('toggle')" class="flex items-center gap-3 cursor-pointer group">

                <!-- Microscope icon — matches PHP sidebar -->
                <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:opacity-90 transition-opacity"
                     style="background: linear-gradient(135deg, #1abc9c, #16a085); box-shadow: 0 4px 12px rgba(26,188,156,0.35);">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.798-1.442 2.798H4.24c-1.47 0-2.44-1.798-1.442-2.798L4.2 15.3" />
                    </svg>
                </div>

                <div v-if="isExpanded" class="flex flex-col whitespace-nowrap overflow-hidden">
                    <h1 class="text-2xl font-bold text-white leading-none tracking-wide">IRB</h1>
                    <p class="text-[10px] text-neutral-content/70 mt-1">منظومة الموافقات البحثية</p>
                </div>
            </div>
        </div>

        <!-- ── Nav Links ─────────────────────────────────────────── -->
        <div class="flex-1 py-6 px-3 flex flex-col gap-2" :class="isExpanded ? 'overflow-y-auto' : 'overflow-visible'">
            <div v-for="link in navLinks" :key="link.id" class="w-full flex">

                <div :class="[!isExpanded ? 'tooltip tooltip-left' : '', 'w-full']" :data-tip="link.label">
                    <RouterLink :to="link.route"
                        class="flex items-center transition-all duration-200 group relative border-r-0 border-l-4 border-transparent"
                        :class="[
                            isExpanded ? 'px-4 py-3 gap-4 justify-start rounded-r-none rounded-l-2xl' : 'justify-center w-14 h-14 mx-auto rounded-2xl',
                            'hover:bg-white/5 text-neutral-content hover:text-white hover:border-l-[#1abc9c]'
                        ]"
                        active-class="bg-white/10 text-white !border-l-[#1abc9c]"
                        style="">

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

        <!-- ── Footer: User info + logout ───────────────────────── -->
        <div class="p-5 mt-auto" style="border-top: 2px solid rgba(26,188,156,0.3); background: linear-gradient(180deg, transparent 0%, rgba(26,188,156,0.05) 100%);">

            <div :class="[!isExpanded ? 'tooltip tooltip-left w-full' : 'w-full']" data-tip="تسجيل الخروج">

                <!-- Expanded: show avatar + name + logout -->
                <div v-if="isExpanded" class="flex items-center gap-3">
                    <!-- Avatar circle -->
                    <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                         style="background: linear-gradient(135deg, #1abc9c, #16a085);">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                    <!-- Name + logout link -->
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-bold text-white truncate m-0 leading-snug">
                            {{ authStore.user?.full_name || 'المستخدم' }}
                        </p>
                        <button
                            class="flex items-center mt-2 gap-1 text-xs font-semibold mt-0.5 transition-colors bg-transparent border-none cursor-pointer p-0"
                            style="color: rgba(255,255,255,0.55);"
                            :disabled="authStore.loading"
                            @click="handleLogout"
                            @mouseover="$event.currentTarget.style.color='#ff7675'"
                            @mouseleave="$event.currentTarget.style.color='rgba(255,255,255,0.55)'">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            تسجيل الخروج
                        </button>
                    </div>
                </div>

                <!-- Collapsed: show only logout icon button -->
                <button v-else
                    class="flex items-center justify-center w-14 h-14 mx-auto rounded-2xl transition-all duration-200 hover:bg-error/20 hover:text-error text-neutral-content/80"
                    :disabled="authStore.loading"
                    @click="handleLogout">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                </button>

            </div>
        </div>

    </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth/auth.store'
import { useNotificationStore } from '@/store/notifications'

const props = defineProps({
    isExpanded: {
        type: Boolean,
        default: true
    }
})

defineEmits(['toggle'])

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

onMounted(() => {
    if (authStore.token) {
        notificationStore.fetchNotifications()
    }
})

const handleLogout = async () => {
    localStorage.removeItem('pending_client_secret');
    await authStore.logout();
    router.push('/login');
}

const role = computed(() => authStore.userRole || 'student')

const navLinks = computed(() => {
    let links = [];

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
    } else if (role.value === 'admin') {
        links.push({
            id: 'admin-payments',
            label: 'إدارة المدفوعات',
            route: '/admin/payments',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" /></svg>`
        });
        links.push({
            id: 'admin-users',
            label: 'إدارة المستخدمين',
            route: '/admin/users',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20h5v-2a3 3 0 00-5.356-1.857M7 20H6a3 3 0 010-6h5a3 3 0 013 3v1a3 3 0 01-3 3zM16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
        });
        links.push({
            id: 'assign-reviewers',
            label: 'تعيين المراجعين',
            route: '/admin/assign-reviewer',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>`
        });
        links.push({
            id: 'pending-students',
            label: 'الموافقة على الطلاب',
            route: '/admin/pending-students',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`
        });
        links.push({
            id: 'add-staff',
            label: 'إضافة موظف',
            route: '/admin/add-staff',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>`
        });
        links.push({
            id: 'logs',
            label: 'سجل النشاطات',
            route: '/logs',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`
        });
    } else if (role.value === 'manager') {
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
    } else if (role.value === 'super_admin') {
        links.push({
            id: 'admin-users',
            label: 'إدارة المستخدمين',
            route: '/admin/users',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20h5v-2a3 3 0 00-5.356-1.857M7 20H6a3 3 0 010-6h5a3 3 0 013 3v1a3 3 0 01-3 3zM16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
        });
        links.push({
            id: 'pending-students',
            label: 'الموافقة على الطلاب',
            route: '/admin/pending-students',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`
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
    } else if (role.value === 'reviewer') {
        links.push({
            id: 'reviewer-dashboard',
            label: 'لوحة التحكم',
            route: '/reviewer/dashboard',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>`
        });
        links.push({
            id: 'reviewer-pending',
            label: 'مهام جديدة',
            route: '/reviewer/pending',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`
        });
        links.push({
            id: 'reviewer-active',
            label: 'أبحاث قيد المراجعة',
            route: '/reviewer/active',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>`
        });
        links.push({
            id: 'reviewer-history',
            label: 'سجل المراجعات',
            route: '/reviewer/history',
            badge: 0,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`
        });
    }

    links.push({
        id: 'notifications',
        label: 'الإشعارات',
        route: '/notifications',
        badge: notificationStore.unreadCount,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>`
    });

    return links;
});
</script>