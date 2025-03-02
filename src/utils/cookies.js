import Cookies from 'js-cookie'

const TokenKey = 'LayerLogic-Auth-X'

export function getToken() {
  return Cookies.get(TokenKey)
}

/**
 * @param {string} token
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
