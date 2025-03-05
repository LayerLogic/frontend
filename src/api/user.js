import service from '@/services/axios'

/**
 * @typedef {'customer' | 'researcher' | 'admin'} UserRole
 * @param {{
 * username: string,
 * email: string,
 * password: string,
 * role: UserRole
 * }} data
 */
export function register(data) {
  return service.post('/auth/register', data)
}

/**
 * @param {{
 * email: string,
 * password: string
 * }} data
 */
export function login(data) {
  return service.post('/auth/login', data)
}

export function logout() {
  return service.post('/auth/logout')
}

export function getProfile() {
  return service.get('/auth/profile')
}
