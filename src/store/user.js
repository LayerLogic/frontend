import { getProfile, login, logout, register } from '@/api/user'
import { deleteUserIdCookie, setUserIdCookie } from '@/services/cookies'
import { defineStore } from 'pinia'

export const UserRole = {
  CUSTOMER: 'customer',
  RESEARCHER: 'researcher',
  ADMIN: 'admin',
}

export const VALID_ROLES = Object.values(UserRole)

/**
 * @typedef {'customer' | 'researcher' | 'admin'} UserRole
 */

/**
 * @typedef {Object} User
 * @property {string} _id - User ID
 * @property {string} email - User email
 * @property {string} username - Username
 * @property {UserRole} role - User role
 */

/**
 * Handles API response validation and error extraction
 * @param {Object} response - API response object
 * @param {string} errorMessage - Default error message if none provided
 * @returns {Object} The response data
 * @throws {Error} If response status is not successful
 */
const handleApiResponse = (response, errorMessage) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data
  }
  throw new Error(response.data?.message || errorMessage)
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: '',
    email: '',
    username: '',
    role: '',
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }),

  getters: {
    /**
     * @returns {boolean}
     */
    isAdmin: (state) => state.role === UserRole.ADMIN,
    isResearcher: (state) => state.role === UserRole.RESEARCHER,
    isCustomer: (state) => state.role === UserRole.CUSTOMER,
    hasRole: (state) => (role) => state.role === role,
    /**
     * @returns {Object}
     */
    userProfile: (state) => ({
      id: state.userId,
      email: state.email,
      username: state.username,
      role: state.role,
    }),
    /**
     * @returns {boolean}
     */
    hasValidRole: (state) => VALID_ROLES.includes(state.role),
  },

  actions: {
    /**
     * @param {boolean} status
     */
    setLoading(status) {
      this.isLoading = status
    },

    /**
     * @param {Error|null} error
     */
    setError(error) {
      this.error = error ? error.message : null
    },

    clearError() {
      this.error = null
    },

    /**
     * @param {User} userData
     */
    updateUserState(userData) {
      if (!userData) {
        throw new Error('Invalid user data received')
      }

      if (!VALID_ROLES.includes(userData.role)) {
        throw new Error(`Invalid role: ${userData.role}`)
      }

      this.userId = userData._id
      this.email = userData.email
      this.username = userData.username
      this.role = userData.role
      this.isAuthenticated = true

      setUserIdCookie(this.userId)
    },

    resetUserState() {
      this.userId = ''
      this.email = ''
      this.username = ''
      this.role = ''
      this.isAuthenticated = false
      this.error = null
      deleteUserIdCookie()
    },

    /**
     * Generic API request handler with loading and error states
     * @param {Function} apiCall - Function that makes the API call
     * @param {string} errorMsg - Default error message
     * @returns {Promise<Object>}
     */
    async executeApiCall(apiCall, errorMsg) {
      this.setLoading(true)
      this.clearError()

      try {
        const result = await apiCall()
        this.setLoading(false)
        return result
      } catch (error) {
        this.setLoading(false)
        this.setError(error)
        console.error(errorMsg, error)
        throw error
      }
    },

    /**
     * @param {{email: string, password: string}} credentials
     * @returns {Promise<Object>}
     */
    async loginUser(credentials) {
      return this.executeApiCall(async () => {
        const response = await login(credentials)
        const data = handleApiResponse(response, 'Login failed')
        this.updateUserState(data.user)
        return data
      }, 'Error logging in user:')
    },

    /**
     * @param {{email: string, password: string, username: string, role: UserRole}} userInfo
     * @returns {Promise<Object>}
     */
    async registerUser(userInfo) {
      return this.executeApiCall(async () => {
        // Validate role before sending to API
        if (!VALID_ROLES.includes(userInfo.role)) {
          throw new Error(`Invalid role: ${userInfo.role}`)
        }

        const response = await register(userInfo)
        const data = handleApiResponse(response, 'Registration failed')
        this.updateUserState(data.user)
        return data
      }, 'Error registering user:')
    },

    /**
     * Logout user
     * @returns {Promise<Object>}
     */
    async logoutUser() {
      return this.executeApiCall(async () => {
        const response = await logout()
        const data = handleApiResponse(response, 'Logout failed')
        this.resetUserState()
        return data
      }, 'Error logging out user:')
    },

    /**
     * Get user profile
     * @returns {Promise<Object>}
     */
    async getUserProfile() {
      return this.executeApiCall(async () => {
        const response = await getProfile()
        const data = handleApiResponse(response, 'Failed to get user profile')
        this.updateUserState(data.user)
        return data
      }, 'Error getting user profile:')
    },
  },
})
