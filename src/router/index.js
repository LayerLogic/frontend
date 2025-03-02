import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/loginView.vue'
import AuthLayout from '@/views/auth/AuthLayout.vue'
import { getToken } from '@/utils/cookies'

const router = createRouter({
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
          component: import('@/views/auth/RegisterView.vue'),
        },
        {
          path: '',
          redirect: { name: 'login' },
        },
      ],
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: import('@/views/dashboard/DashboardLayout.vue'),
      children: [
        {
          path: '/dashboard/admin',
          name: 'admin',
          component: import('@/views/dashboard/admin/AdminView.vue'),
        },
        {
          path: '/dashboard/researcher',
          name: 'researcher',
          component: import('@/views/dashboard/researcher/ResearcherView.vue'),
        },
        {
          path: '/dashboard/customer',
          name: 'customer',
          component: import('@/views/dashboard/customer/CustomerView.vue'),
        },
      ],
      beforeEnter: (to, _, next) => {
        const token = getToken()
        if (token) {
          next()
        } else {
          next({
            name: 'login',
            query: {
              from: to.name,
            },
          })
        }
      },
    },
  ],
})

export default router
