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
                    <span v-if="isExpanded" class="whitespace-nowrap text-sm font-medium">تسجيل الخروج</span>
                </button>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth/auth.store'

const props = defineProps({
    isExpanded: {
        type: Boolean,
        default: true
    }
})

defineEmits(['toggle'])
const router    = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
    await authStore.logout()
    router.push('/login')
}
// Data-driven links mapping exact icons from your screenshots
const navLinks = ref([
    {
        id: 'dashboard',
        label: 'لوحة التحكم',
        route: '/dashboard',
        badge: 0,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>`
    },
    {
        id: 'new-request',
        label: 'تقديم بحث جديد',
        route: '/new-request',
        badge: 0,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>`
    },
    {
        id: 'my-researches',
        label: 'أبحاثي',
        route: '/my-researches',
        badge: 0,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>`
    },
    {
        id: 'notifications',
        label: 'الإشعارات',
        route: '/notifications',
        badge: 8,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>`
    }
])
</script>