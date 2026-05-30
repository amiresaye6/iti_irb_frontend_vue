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
        meta: { layout: 'auth', guest: true },
        component: () => import('../views/global/LoginView.vue')
    },

    // --- Main System Pages ---
    {
        path: '/dashboard',
        name: "Dashboard",
        meta: { layout: 'main', requiresAuth: true },
        component: () => import('../views/global/ComponentsShowcase.vue')
    },
    
    // --- Student Payment Pages ---
    {
        path: '/student/payments/pending',
        name: "Pending Payments",
        meta: { layout: 'main', requiresAuth: true, role: 'student' },
        component: () => import('../views/student/PendingPayments.vue')
    },
    {
        path: '/student/payments/history',
        name: "Payment History",
        meta: { layout: 'main', requiresAuth: true, role: 'student' },
        component: () => import('../views/student/PaymentHistory.vue')
    },
    {
        path: '/student/payments/receipt/:id',
        name: "Payment Receipt",
        meta: { layout: 'main', requiresAuth: true, role: 'student' },
        component: () => import('../views/student/PaymentReceipt.vue')
    },
    {
        path: '/payment-status',
        name: "Payment Status Callback",
        meta: { layout: 'main', requiresAuth: true },
        component: () => import('../views/student/PaymentStatusCallback.vue')
    },

    {
        // Catch-all route for any undefined paths
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/global/NotFoundView.vue'),
        meta: { layout: 'landing' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Navigation guard for authentication and role-based access
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    // If route requires auth and user is not logged in
    if (to.meta.requiresAuth && !token) {
        return next('/login');
    }

    // If route is guest-only (like login) and user is logged in
    if (to.meta.guest && token) {
        return next('/dashboard');
    }

    // If route requires a specific role
    if (to.meta.role && user?.role !== to.meta.role) {
        return next('/dashboard');
    }

    next();
});

export default router;