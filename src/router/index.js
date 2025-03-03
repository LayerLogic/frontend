import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/views/auth/AuthLayout.vue'
import LoginView from '@/views/auth/loginView.vue'
import DashboardLayout from '@/views/dashboard/dashboardLayout.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AuthLayout,
      children: [
        {
          path: '/auth/login',
          name: 'login',
          component: LoginView,
        },
        {
          path: '/auth/register',
          name: 'register',
          component: () => import('@/views/auth/RegisterView.vue'),
        },
        {
          path: '',
          name: 'home_redirect',
          redirect: { name: 'login' },
        },
      ],
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      name: 'dashboard',
    },
  ],
})

export default router
