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
    {
    path: '/register',
    name: 'Register',
    meta: { layout: 'auth' },
    component: () => import('../views/global/RegisterView.vue')
    },

    // --- Main System Pages ---
    // {
    //     path: '/dashboard',
    //     name: "Dashboard",
    //     meta: { layout: 'main', requiresAuth: true },
    //     component: () => import('../views/global/ComponentsShowcase.vue')
    // },

// --- Admin ---
   {
    path: '/admin/add-staff',
    name: 'AddStaff',
    meta: { layout: 'main', role: 'admin' },
    component: () => import('../views/admin/AddStaffView.vue')
   },
   {
    path: '/admin/users',
    name: 'AllUsers',
    meta: { layout: 'main', role: ['admin', 'super_admin'] },
    component: () => import('../views/admin/AllUsersView.vue')
  },
  {
    path: '/admin/pending-students',
    name: 'PendingStudents',
    meta: { layout: 'main', role: ['admin', 'super_admin'] },
    component: () => import('../views/admin/PendingStudentsView.vue')
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
        meta: { layout: 'main', requiresAuth: true, role: ['student', 'admin', 'manager'] },
        component: () => import('../views/student/PaymentReceipt.vue')
    },
    {
        path: '/payment-status',
        name: "Payment Status Callback",
        meta: { layout: 'main', requiresAuth: true },
        component: () => import('../views/student/PaymentStatusCallback.vue')
    },

    // --- Admin / Manager Payment Pages ---
    {
        path: '/admin/payments',
        name: "Admin Payments Dashboard",
        meta: { layout: 'main', requiresAuth: true, role: ['admin', 'manager', 'super_admin'] },
        component: () => import('../views/admin/AdminPaymentsDashboard.vue')
    },
    {
        path: '/admin/payments/set-fee/:id',
        alias: '/admin/set-fee/:id',
        name: "Set Payment Fee",
        meta: { layout: 'main', requiresAuth: true, role: ['admin', 'manager', 'super_admin'] },
        component: () => import('../views/admin/SetPaymentFee.vue')
    },
    {
        // logs page
        path: '/logs',
        name: 'Logs',
        component: () => import('../views/admin/logs.vue'),
        meta: { layout: 'main', requiresAuth: true, role: ['admin','manager','super_admin'] }
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
    path: '/profile',
    name: 'Profile',
    meta: { layout: 'main' },
    component: () => import('../views/student/ProfileView.vue')
    },
    {
        path: '/student/Dashboard',
        name: "Student Dashboard",
        meta: { layout: 'main', requiresAuth: true, role: 'student' },
        component: () => import('../views/student/Dashboard.vue')
    },
    {
        path: '/student/my-researches',
        name: "Student my-researches",
        meta: { layout: 'main', requiresAuth: true, role: 'student' },
        component: () => import('../views/student/my-researches.vue')
    },
    {
        path: '/student/applications/:id',
        name: "Application Details",
        meta: { layout: 'main', requiresAuth: true, role: 'student' },
        component: () => import('../views/student/ApplicationDetails.vue')
    },
    {
        path: '/student/new-application',
        name: "New Application",
        meta: { layout: 'main', requiresAuth: true, role: 'student' },
        component: () => import('../views/student/NewApplication.vue')
    },
    {
        path: '/student/accepted',
        name: "Accepted Application",
        meta: { layout: 'main', requiresAuth: true, role: 'student' },
        component: () => import('../views/student/accepted.vue')
    },
    {
        path: '/student/edit-application/:id',
        name: "Edit-application",
        meta: { layout: 'main', requiresAuth: true, role: 'student' },
        component: () => import('../views/student/edit-application.vue')
    },
    {
        path: '/student/accept-modification',
        name: "Accept Modification",
        meta: { layout: 'main', requiresAuth: true, role: 'student' },
        component: () => import('../views/student/accept-modification.vue')
    },

    // --- Manager Pages ---
    {
        path: '/manager/dashboard',
        name: "Manager Dashboard",
        meta: { layout: 'main' },
        component: () => import('../views/manager/Dashboard.vue')
    },
    {
        path: '/manager/final-approvals',
        name: "Final Approvals",
        meta: { layout: 'main' },
        component: () => import('../views/manager/FinalApprovals.vue')
    },
    // --- Reviewer Pages ---
    {
        path: '/reviewer/dashboard',
        name: "Reviewer Dashboard",
        meta: { layout: 'main', requiresAuth: true, role: 'reviewer' },
        component: () => import('../views/reviewer/Dashboard.vue')
    },
    // --- Dashboard Redirect ---
    {
        path: '/dashboard',
        name: "DashboardRedirect",
        meta: { requiresAuth: true },
        beforeEnter: (to, from, next) => {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            if (user?.role === 'admin' || user?.role === 'super_admin') {
                return next('/admin/users');
            } else if (user?.role === 'manager') {
                return next('/manager/dashboard');
            } else if (user?.role === 'student') {
                return next('/student/Dashboard');
            } else if (user?.role === 'reviewer') {
                return next('/reviewer/dashboard');
            }
            next('/login');
        }
    },
    {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/global/ForbiddenView.vue'),
    meta: { layout: 'landing', requiresAuth: true } 
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (to.meta.requiresAuth && !token) {
        return next('/login');
    }

    if (to.meta.guest && token) {
       if (user?.role === 'super_admin' || user?.role === 'admin') {
        return next('/admin/users');
    } else {
        return next('/student/Dashboard');
    }
    }

    if (to.meta.role) {
        const allowedRoles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role];
        if (!allowedRoles.includes(user?.role)) {
           return next('/403');
        }
    }

    next();
});

export default router;