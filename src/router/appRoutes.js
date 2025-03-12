import AppLayout from '@/views/app/AppLayout.vue'
import DashboardLayout from '@/views/app/dashboard/DashboardLayout.vue'
import CreateTrailView from '@/views/app/trail/CreateTrailView.vue'

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
      path: 'create-trail',
      component: CreateTrailView,
      name: 'create_trail',
      meta: { title: 'Create Trail', showOnSidebar: true },
    },
  ],
}

export default appRoutes
