import AppLayout from '@/views/app/AppLayout.vue'
import DashboardLayout from '@/views/app/dashboard/DashboardLayout.vue'

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
  ],
}

export default appRoutes
