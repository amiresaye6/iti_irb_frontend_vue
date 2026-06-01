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
    {
    path: '/register',
    name: 'Register',
    meta: { layout: 'auth' },
    component: () => import('../views/global/RegisterView.vue')
    },

    // --- Main System Pages ---
    {
        path: '/dashboard',
        name: "Dashboard",
        meta: { layout: 'main' },
        component: () => import('../views/global/ComponentsShowcase.vue')
    },
    
    // --- Reviewer Pages ---
    {
        path: '/reviewer/dashboard',
        name: "ReviewerDashboard",
        meta: { layout: 'main' },
        component: () => import('../views/reviewer/DashboardView.vue')
    },
    {
        path: '/reviewer/pending',
        name: "PendingAssignments",
        meta: { layout: 'main' },
        component: () => import('../views/reviewer/PendingAssignments.vue')
    },
    {
        path: '/reviewer/active',
        name: "AssignedResearches",
        meta: { layout: 'main' },
        component: () => import('../views/reviewer/AssignedResearches.vue')
    },
    {
        path: '/reviewer/review/:id',
        name: "ReviewForm",
        meta: { layout: 'main' },
        component: () => import('../views/reviewer/ReviewForm.vue')
    },
    {
        path: '/reviewer/history',
        name: "AssignmentHistory",
        meta: { layout: 'main' },
        component: () => import('../views/reviewer/AssignmentHistory.vue')
    },
    
    // --- Notifications Pages ---
    {
        path: '/notifications',
        name: "UserNotifications",
        meta: { layout: 'main' },
        component: () => import('../views/notifications/UserNotifications.vue')
    },
    {
        path: '/notifications/:id',
        name: "NotificationDetails",
        meta: { layout: 'main' },
        component: () => import('../views/notifications/NotificationDetails.vue')
    },
    // --- student ---
    {
    path: '/profile',
    name: 'Profile',
    meta: { layout: 'main' },
    component: () => import('../views/student/ProfileView.vue')
   },


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
    meta: { layout: 'main', role: 'admin' },
    component: () => import('../views/admin/AllUsersView.vue')
  },
  {
    path: '/admin/pending-students',
    name: 'PendingStudents',
    meta: { layout: 'main', role: 'admin' },
    component: () => import('../views/admin/PendingStudentsView.vue')
   },

    // --- Error Pages ---
    {
        path: '/unauthorized',
        name: 'Unauthorized',
        component: () => import('../views/global/UnauthorizedView.vue'),
        meta: { layout: 'landing' }
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