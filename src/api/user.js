import request from '@/services/axios'

/**
 * @param {{
 * username: string,
 * email: string,
 * password: string,
 * role: string
 * }} data
 */
export function resgister(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data,
  })
}

/**
 * @param {{
 * email: string,
 * password: string
 * }} data
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}

export function getInfo() {
  return request({
    url: '/auth/profile',
    method: 'get',
  })
}

export function logout() {
  console.log('called')
  return request({
    url: '/auth/logout',
    method: 'post',
  })
}
