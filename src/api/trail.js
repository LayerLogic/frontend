import service from '@/services/axios'

/**
 * @param {string} id
 */
export function getTrailById(id) {
  return service.get(`/researcher/trails/${id}`)
}

export function getAllUserTrails() {
  return service.get('/researcher/trails')
}

/**
 * @param {{
 * name: string,
 * tags: string[],
 * procedures: string,
 * notes: string
 * }} data
 */
export function createTrail(data) {
  return service.post('/researcher/trails', data)
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
export function updateTrail(id, data) {
  return service.patch(`/researcher/trails/${id}`, data)
}

/**
 * @param {string} id
 */
export function deleteTrail(id) {
  return service.delete(`/researcher/trails/${id}`)
}
