import { useAuthStore } from '@/store/auth';
import { createRouter, createWebHistory } from "vue-router";

// Define the routes for the application
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/sign_in",
      name: "sign_in",
      component: () => import("@/views/auth/SignIn.vue"),
    },
    {
      path: "/sign_on",
      name: "sign_on",
      component: () => import("@/views/auth/SignOn.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/views/Profile.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/forget_password",
      name: "forget_password",
      component: () => import("@/views/auth/ForgetPassword.vue"),
    },
  ],
});

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/'); // Redirect to home if not authenticated
  } else {
    next(); // Proceed to the route
  }
});

export default router; // Export the router instance
export const routes = router.options.routes; // Export the routes array