import AppLayout from '@/views/app/AppLayout.vue'
import DashboardLayout from '@/views/app/dashboard/DashboardLayout.vue'
import TestLayout from '@/views/app/testing/TestLayout.vue'

const appRoutes = {
  path: '/app',
  component: AppLayout,
  name: 'app',
  redirect: { name: 'dashboard' },
  children: [
    {
      path: 'dashboard',
      component: DashboardLayout,
      name: 'dashboard',
      meta: { title: 'Dashboard', showOnSidebar: true },
    },
    {
      path: 'create-test',
      component: TestLayout,
      name: 'create_test',
      meta: { title: 'Create test', showOnSidebar: true },
    },
  ],
}

export default appRoutes
