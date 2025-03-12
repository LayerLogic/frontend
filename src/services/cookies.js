import Cookies from 'js-cookie'

const KEY_user_id = 'user_id'
const KEY_sidebar_status = 'sidebar_status'

export function getUserIdCookie() {
  return Cookies.get(KEY_user_id)
}

export function setUserIdCookie(userId) {
  return Cookies.set(KEY_user_id, userId, {
    secure: import.meta.env.NODE_ENV === 'production',
  })
}

export function deleteUserIdCookie() {
  return Cookies.remove(KEY_user_id)
}

export function getSidebarStatusCookie() {
  return Cookies.get(KEY_sidebar_status)
}

export function setSidebarStatusCookie(status) {
  return Cookies.set(KEY_sidebar_status, status)
}

export function deleteSidebarStatusCookie() {
  return Cookies.remove(KEY_sidebar_status)
}
