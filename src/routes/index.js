import { createWebHistory, createRouter } from "vue-router";

const routes = [
    // --- Landing Pages ---
    {
        path: '/',
        name: "Home",
        meta: { layout: 'landing' },
        component: () => import('../views/global/HomeView.vue')
    },
    {
        path: '/about',
        name: "About Us",
        meta: { layout: 'landing' },
        component: () => import('../views/global/AboutView.vue')
    },

    // --- Auth Pages ---
    {
        path: '/login',
        name: "Login",
        meta: { layout: 'auth' },
        component: () => import('../views/global/LoginView.vue')
    },

    // --- Main System Pages ---
    {
        path: '/dashboard',
        name: "Dashboard",
        meta: { layout: 'main' },
        component: () => import('../views/global/ComponentsShowcase.vue')
    },

    {
        // Catch-all route for any undefined paths
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/global/NotFoundView.vue'),
        meta: { layout: 'landing' }
    },

    // --- student pages ---
    {
        path: '/student/dashboard',
        name: "Student Dashboard",
        meta: { layout: 'main' },
        component: () => import('../views/student/Dashboard.vue')
    },
    {
        path: '/applications/:id',
        name: "Application Details",
        meta: { layout: 'main' },
        component: () => import('../views/student/ApplicationDetails.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;