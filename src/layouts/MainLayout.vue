<template>
    <div class="drawer lg:drawer-open bg-base-200 min-h-screen">
        <input id="main-drawer" type="checkbox" class="drawer-toggle" />

        <div class="drawer-content flex flex-col transition-all duration-300">

            <div class="navbar bg-neutral text-neutral-content lg:hidden sticky top-0 z-40 shadow-sm px-4">
                <div class="flex-none">
                    <label for="main-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            class="inline-block w-6 h-6 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </label>
                </div>
                <div class="flex-1 px-2 mx-2 font-bold text-lg">IRB System</div>
            </div>

            <main class="flex-1 p-4 md:p-8 overflow-x-hidden">

                <div class="card bg-base-100 shadow-sm border border-base-300 mb-8">
                </div>

                <slot></slot>

            </main>
        </div>

        <div class="drawer-side z-50 lg:overflow-visible">
            <label for="main-drawer" aria-label="close sidebar" class="drawer-overlay lg:hidden"></label>

            <AppSidebar :is-expanded="isSidebarExpanded" @toggle="toggleSidebar" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import trackMount from '@/utils/mountTracker';
import AppSidebar from '../components/layout/AppSidebar.vue'

trackMount("About view")

// Global state for desktop sidebar expansion
const isSidebarExpanded = ref(true)

const toggleSidebar = () => {
    isSidebarExpanded.value = !isSidebarExpanded.value
}
</script>