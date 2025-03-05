import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/views/auth/AuthLayout.vue'
import LoginView from '@/views/auth/loginView.vue'
import DashboardLayout from '@/views/dashboard/DashboardLayout.vue'
import { useUserStore } from '@/store/user'
import { getUserIdCookie } from '@/services/cookies'
import AdminView from '@/views/dashboard/admin/AdminView.vue'
import ResearcherView from '@/views/dashboard/researcher/ResearcherView.vue'
import CustomerView from '@/views/dashboard/customer/CustomerView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

// valid roles and role hierarchy
const ROLES = {
  ADMIN: 'admin',
  RESEARCHER: 'researcher',
  CUSTOMER: 'customer',
}

// Role hierarchy - defines what roles can access which dashboards
const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.RESEARCHER, ROLES.CUSTOMER], // Admin can access all
  [ROLES.RESEARCHER]: [ROLES.RESEARCHER],
  [ROLES.CUSTOMER]: [ROLES.CUSTOMER],
}

const isValidRole = (role) => Object.values(ROLES).includes(role)

// Function to check if a user with given role can access routes requiring certain roles
const canAccessRoute = (userRole, requiredRoles) => {
  if (!isValidRole(userRole)) return false
  if (!requiredRoles || requiredRoles.length === 0) return true

  const allowedRoles = ROLE_HIERARCHY[userRole] || []
  return requiredRoles.some((role) => allowedRoles.includes(role))
}

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
          meta: { title: 'LayerLogic | Login' },
        },
        {
          path: '/auth/register',
          name: 'register',
          component: () => import('@/views/auth/RegisterView.vue'),
          meta: { title: 'LayerLogic | Register' },
        },
        {
          path: '',
          name: 'home_redirect',
          redirect: { name: 'login' },
        },
        {
          path: '/auth',
          name: 'auth_redirect',
          redirect: { name: 'login' },
        },
      ],
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      name: 'dashboard',
      meta: { title: 'Dashboard' },
      children: [
        {
          path: '/dashboard/admin', // Fixed typo
          component: AdminView,
          name: 'admin_dashboard',
          meta: {
            title: 'Dashboard | Admin',
            roles: [ROLES.ADMIN], // Use constants instead of strings
          },
        },
        {
          path: '/dashboard/researcher', // Fixed typo
          component: ResearcherView,
          name: 'researcher_dashboard',
          meta: {
            title: 'Dashboard | Researcher',
            roles: [ROLES.ADMIN, ROLES.RESEARCHER], // Using role hierarchy
          },
        },
        {
          path: '',
          component: CustomerView,
          name: 'customer_dashboard',
          meta: {
            title: 'Dashboard',
            roles: [ROLES.ADMIN, ROLES.CUSTOMER], // Using role hierarchy
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not_found',
      component: NotFoundView,
      meta: {
        title: 'LayerLogic | 404',
      },
    },
  ],
})

const publicURLs = ['/', '/auth/login', '/auth/register']
router.beforeEach(async (to, __, next) => {
  const userStore = useUserStore()
  const userId = getUserIdCookie()

  // Helper function to handle authentication errors
  const handleAuthError = (error) => {
    console.error('Authentication error:', error)
    userStore.resetUserState()
    return next({ name: 'login' })
  }

  // Helper function to handle unauthorized access attempts
  const handleUnauthorized = (userRole, path) => {
    console.warn(`User with role ${userRole} attempted to access restricted route: ${path}`)
    return next({ name: 'not_found' })
  }

  try {
    const requiresAuth = !publicURLs.includes(to.path)

    if (!userId) {
      return requiresAuth ? next({ name: 'login' }) : next()
    }

    if (!userStore.isAuthenticated) {
      try {
        await userStore.getUserProfile()

        if (!userStore.hasValidRole) {
          console.warn(`Invalid user role detected: ${userStore.role}`)
          return handleAuthError(new Error('Invalid user role'))
        }

        // If user is on public route, redirect to their dashboard
        if (!requiresAuth) {
          return next({ name: `${userStore.role}_dashboard` })
        }

        // if user role dosen't exist in meta.roles run this
        if (to.meta.roles && !canAccessRoute(userStore.role, to.meta.roles)) {
          return handleUnauthorized(userStore.role, to.path)
        }
      } catch (error) {
        return handleAuthError(error)
      }
    } else {
      // User is already authenticated

      if (!userStore.hasValidRole) {
        console.warn(`Invalid authenticated user role: ${userStore.role}`)
        return handleAuthError(new Error('Invalid user role'))
      }

      // Redirect authenticated users away from public pages
      if (!requiresAuth) {
        return next({ name: `${userStore.role}_dashboard` })
      }

      if (to.meta.roles && !canAccessRoute(userStore.role, to.meta.roles)) {
        console.warn(
          `User with role ${userStore.role} attempted to access restricted route: ${to.path}`,
        )
        return next({ name: 'not_found' })
      }
    }

    next()
  } catch (error) {
    console.error('Unexpected error during route navigation:', error)
    return next({ name: 'login' })
  }
})

router.beforeResolve((to, _, next) => {
  document.title = to.meta.title || 'LayerLogic'
  next()
})

export default router
