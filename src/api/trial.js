import service from '@/services/axios'

/**
 * @param {string} id
 */
export function gettrialById(id) {
  return service.get(`/researcher/trials/${id}`)
}

export function getAlltrials() {
  return service.get('/researcher/trials')
}

/**
 * @param {{
 * name: string,
 * tags: string[],
 * procedures: string,
 * notes: string
 * }} data
 */
export function createtrial(data) {
  return service.post('/researcher/trials', data)
}

/**
 * @param {string} id
 * @param {{
 * name: string?,
 * tags: string[]?,
 * procedures: string?,
 * notes: string?
 * }} data
 */
export function updatetrial(id, data) {
  return service.patch(`/researcher/trials/${id}`, data)
}

/**
 * @param {string} id
 */
export function deletetrial(id) {
  return service.delete(`/researcher/trials/${id}`)
}
