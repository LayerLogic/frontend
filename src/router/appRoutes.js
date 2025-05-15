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
      meta: { title: 'Dashboard', showOnSidebar: true, icon: 'mdi-view-dashboard-outline' },
    },
    {
      path: 'trial/:trialId',
      component: () => import('@/views/app/dashboard/researcher/TrialView.vue'),
      name: 'trial',
      meta: { title: 'Trial', showOnSidebar: false, icon: 'mdi-file-document-outline' },
    },
  ],
}

export default appRoutes
