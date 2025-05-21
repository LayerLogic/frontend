import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useSidebarStore } from '@/store/sidebar'
import { getUserIdCookie } from '@/services/cookies'
import NotFoundView from '@/views/NotFoundView.vue'
import authRoutes from './authRoutes'
import appRoutes from './appRoutes'

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

// Helper function to extract paths by recursion
const extractPaths = (router) => {
  const paths = [router.path]
  if (router.children && router.children.length > 0) {
    for (const child of router.children) {
      const childPaths = extractPaths(child)
      paths.push(...childPaths)
    }
  }

  return paths
}

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    authRoutes,
    appRoutes,
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

const publicURLs = [...extractPaths(authRoutes)]
router.beforeEach(async (to, __, next) => {
  const userStore = useUserStore()
  const sidebarStore = useSidebarStore()
  const userId = getUserIdCookie()

  // setting routes in sidebar store
  const navGroup = sidebarStore.navigationGroups
  if (navGroup.length === 0) {
    const routes = router.getRoutes()
    sidebarStore.setRoutes(routes)
  }

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
          return next({ name: 'dashboard' })
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
        return next({ name: 'dashboard' })
      }

      if (to.meta.roles && !canAccessRoute(userStore.role, to.meta.roles)) {
        return handleUnauthorized(userStore.role, to.path)
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
