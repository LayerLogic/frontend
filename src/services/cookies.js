import Cookies from 'js-cookie'

const KEY = 'user_id'

export function getUserIdCookie() {
  return Cookies.get(KEY)
}

export function setUserIdCookie(userId) {
  return Cookies.set(KEY, userId, {
    secure: import.meta.env.NODE_ENV === 'production',
  })
}

export function deleteUserIdCookie() {
  return Cookies.remove(KEY)
}
