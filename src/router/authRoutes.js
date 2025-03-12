import AuthLayout from '@/views/auth/AuthLayout.vue'
import LoginView from '@/views/auth/loginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'

const authRoutes = {
  path: '/',
  name: 'home',
  component: AuthLayout,
  redirect: { name: 'login' },
  children: [
    {
      path: '/auth/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'LayerLogic | Login' },
      children: [
        {
          path: '/testtttt',
          name: 'registerssss',
          component: RegisterView,
          meta: { title: 'LayerLogic | Register' },
        },
      ],
    },
    {
      path: '/auth/register',
      name: 'register',
      component: RegisterView,
      meta: { title: 'LayerLogic | Register' },
    },
    {
      path: '/auth',
      name: 'auth_redirect',
      redirect: { name: 'login' },
    },
  ],
}

export default authRoutes
