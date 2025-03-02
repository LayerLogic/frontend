/**
 * @param {string} token
 */
export function getUserRole(token) {
  if (!token) {
    return null
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || null
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}
