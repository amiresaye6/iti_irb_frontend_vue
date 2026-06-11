import { createWebHistory, createRouter } from "vue-router";

const routes = [
  // =============================================
  //  PUBLIC / LANDING PAGES
  // =============================================

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
    {
    path: '/reset-password',
    name: 'ResetPassword',
    meta: { layout: 'auth', guest: true },
    component: () => import('../views/global/ResetPassword.vue')
    },

    // // --- Main System Pages ---
    // {
    //     path: '/dashboard',
    //     name: "Dashboard",
    //     meta: { layout: 'main' },
    //     component: () => import('../views/global/ComponentsShowcase.vue')
    // },
    
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
    meta: { layout: 'main', role: ['admin', 'super_admin'] },
    component: () => import('../views/admin/AllUsersView.vue')
  },
  {
    path: "/about",
    name: "AboutUs",
    meta: { layout: "landing" },
    component: () => import("../views/global/AboutView.vue"),
  },

  // =============================================
  //  AUTH PAGES (guest-only)
  // =============================================
  {
    path: "/login",
    name: "Login",
    meta: { layout: "auth", guest: true },
    component: () => import("../views/global/LoginView.vue"),
  },
  {
    path: "/register",
    name: "Register",
    meta: { layout: "auth" },
    component: () => import("../views/global/RegisterView.vue"),
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    meta: { layout: "auth", guest: true },
    component: () => import("../views/global/ResetPassword.vue"),
  },
  {
    path: '/forget-password',
    name: 'forget-password',
    component: () => import('@/views/global/ForgetPassword.vue'),
    meta: { layout: "auth",guest: true },
},


  // =============================================
  //  DASHBOARD REDIRECT
  //  Redirects each role to their own dashboard
  // =============================================
  {
    path: "/dashboard",
    name: "DashboardRedirect",
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (user?.role === "admin" || user?.role === "super_admin") {
        return next("/admin/dashboard");
      } else if (user?.role === "manager") {
        return next("/manager/dashboard");
      } else if (user?.role === "student") {
        return next("/student/dashboard");
      } else if (user?.role === "reviewer") {
        return next("/reviewer/dashboard");
      }

      next("/login");
    },
  },

  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    meta: { layout: 'main', requiresAuth: true, role: ['admin', 'manager', 'super_admin'] },
    component: () => import('../views/admin/DashboardView.vue')
  },

  // =============================================
  //  STUDENT PAGES
  // =============================================
  {
    path: "/student/dashboard",
    name: "StudentDashboard",
    meta: { layout: "main", requiresAuth: true, role: "student" },
    component: () => import("../views/student/Dashboard.vue"),
  },
  {
    path: "/student/new-application",
    name: "NewApplication",
    meta: { layout: "main", requiresAuth: true, role: "student" },
    component: () => import("../views/student/NewApplication.vue"),
  },
  {
    path: "/student/my-researches",
    name: "StudentMyResearches",
    meta: { layout: "main", requiresAuth: true, role: "student" },
    component: () => import("../views/student/my-researches.vue"),
  },
  {
    path: "/student/applications/:id",
    name: "ApplicationDetails",
    meta: { layout: "main", requiresAuth: true, role: "student" },
    component: () => import("../views/student/ApplicationDetails.vue"),
  },
  {
    path: "/student/accepted",
    name: "AcceptedApplication",
    meta: { layout: "main", requiresAuth: true, role: "student" },
    component: () => import("../views/student/accepted.vue"),
  },
  {
    path: "/student/edit-application/:id",
    name: "EditApplication",
    meta: { layout: "main", requiresAuth: true, role: "student" },
    component: () => import("../views/student/edit-application.vue"),
  },
  {
    path: "/student/accept-modification",
    name: "AcceptModification",
    meta: { layout: "main", requiresAuth: true, role: "student" },
    component: () => import("../views/student/accept-modification.vue"),
  },
  {
    path: "/student/payments/pending",
    name: "PendingPayments",
    meta: { layout: "main", requiresAuth: true, role: "student" },
    component: () => import("../views/student/PendingPayments.vue"),
  },
  {
    path: "/student/payments/history",
    name: "PaymentHistory",
    meta: { layout: "main", requiresAuth: true, role: "student" },
    component: () => import("../views/student/PaymentHistory.vue"),
  },
  {
    path: "/student/payments/receipt/:id",
    name: "PaymentReceipt",
    meta: { layout: "main", requiresAuth: true, role: ["student", "admin", "manager"] },
    component: () => import("../views/student/PaymentReceipt.vue"),
  },

  // =============================================
  //  REVIEWER PAGES
  // =============================================
  {
    path: "/reviewer/dashboard",
    name: "ReviewerDashboard",
    meta: { layout: "main", requiresAuth: true, role: "reviewer" },
    component: () => import("../views/reviewer/DashboardView.vue"),
  },
  {
    path: "/reviewer/pending",
    name: "PendingAssignments",
    meta: { layout: "main", requiresAuth: true, role: "reviewer" },
    component: () => import("../views/reviewer/PendingAssignments.vue"),
  },
  {
    path: "/reviewer/active",
    name: "AssignedResearches",
    meta: { layout: "main", requiresAuth: true, role: "reviewer" },
    component: () => import("../views/reviewer/AssignedResearches.vue"),
  },
  {
    path: "/reviewer/review/:id",
    name: "ReviewForm",
    meta: { layout: "main", requiresAuth: true, role: "reviewer" },
    component: () => import("../views/reviewer/ReviewForm.vue"),
  },
  {
    path: "/reviewer/history",
    name: "AssignmentHistory",
    meta: { layout: "main", requiresAuth: true, role: "reviewer" },
    component: () => import("../views/reviewer/AssignmentHistory.vue"),
  },

  // =============================================
  //  ADMIN PAGES
  // =============================================
  {
    path: "/admin/users",
    name: "AllUsers",
    meta: { layout: "main", requiresAuth: true, role: ["admin", "super_admin"] },
    component: () => import("../views/admin/AllUsersView.vue"),
  },
  {
    path: "/admin/pending-students",
    name: "PendingStudents",
    meta: { layout: "main", requiresAuth: true, role: ["admin", "super_admin"] },
    component: () => import("../views/admin/PendingStudentsView.vue"),
  },
  {
    path: "/admin/assign-reviewer",
    name: "AssignReviewers",
    meta: { layout: "main", requiresAuth: true, role: "admin" },
    component: () => import("../views/admin/reviews/AssignReviewers.vue"),
  },
  {
    path: "/admin/assign-reviewer/:id",
    name: "AssignForm",
    meta: { layout: "main", requiresAuth: true, role: "admin" },
    component: () => import("../views/admin/reviews/AssignForm.vue"),
  },
  {
    path: "/admin/add-staff",
    name: "AddStaff",
    meta: { layout: "main", requiresAuth: true, role: "admin" },
    component: () => import("../views/admin/AddStaffView.vue"),
  },
  {
    path: "/admin/payments",
    name: "AdminPaymentsDashboard",
    meta: { layout: "main", requiresAuth: true, role: ["admin", "manager", "super_admin"] },
    component: () => import("../views/admin/AdminPaymentsDashboard.vue"),
  },
  {
    path: "/admin/payments/set-fee/:id",
    alias: "/admin/set-fee/:id",
    name: "SetPaymentFee",
    meta: { layout: "main", requiresAuth: true, role: ["admin", "manager", "super_admin"] },
    component: () => import("../views/admin/SetPaymentFee.vue"),
  },

  // =============================================
  //  MANAGER PAGES
  // =============================================
  {
    path: "/manager/dashboard",
    name: "ManagerDashboard",
    meta: { layout: "main", requiresAuth: true, role: "manager" },
    component: () => import("../views/manager/Dashboard.vue"),
  },
  {
    path: "/manager/final-approvals",
    name: "FinalApprovals",
    meta: { layout: "main", requiresAuth: true, role: "manager" },
    component: () => import("../views/manager/FinalApprovalsHistory.vue"),
  },
  {
    path: "/manager/decisions/:id",
    name: "ManagerDecisionDetails",
    meta: { layout: "main", requiresAuth: true, role: "manager" },
    component: () => import("../views/manager/DecisionDetails.vue"),
  },

  // =============================================
  //  SHARED PAGES (all authenticated users)
  // =============================================
  {
    path: "/profile",
    name: "Profile",
    meta: { layout: "main", requiresAuth: true },
    component: () => import("../views/student/ProfileView.vue"),
  },
  {
    path: "/notifications",
    name: "UserNotifications",
    meta: { layout: "main", requiresAuth: true },
    component: () => import("../views/notifications/UserNotifications.vue"),
  },
  {
    path: "/notifications/:id",
    name: "NotificationDetails",
    meta: { layout: "main", requiresAuth: true },
    component: () => import("../views/notifications/NotificationDetails.vue"),
  },
  {
    path: "/payment-status",
    name: "PaymentStatusCallback",
    meta: { layout: "main", requiresAuth: true },
    component: () => import("../views/student/PaymentStatusCallback.vue"),
  },
  {
    path: "/logs",
    name: "Logs",
    meta: { layout: "main", requiresAuth: true, role: ["admin", "manager", "super_admin"] },
    component: () => import("../views/admin/logs.vue"),
  },

  // =============================================
  //  ERROR PAGES
  // =============================================
  {
    path: "/unauthorized",
    name: "Unauthorized",
    meta: { layout: "landing" },
    component: () => import("../views/global/UnauthorizedView.vue"),
  },
  {
    path: "/403",
    name: "Forbidden",
    meta: { layout: "landing", requiresAuth: true },
    component: () => import("../views/global/ForbiddenView.vue"),
  },

  // =============================================
  //  CATCH-ALL 404 (must be last)
  // =============================================
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    meta: { layout: "landing" },
    component: () => import("../views/global/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // If route requires auth and user is not logged in
  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  // If route is guest-only (like login) and user is logged in
  if (to.meta.guest && token) {
    return next("/dashboard");
  }

  // If route requires a specific role (supports string or array)
  if (to.meta.role) {
    const allowedRoles = Array.isArray(to.meta.role)
      ? to.meta.role
      : [to.meta.role];
    if (!allowedRoles.includes(user?.role)) {
      return next("/dashboard");
    }
  }

  next();
});

export default router;
