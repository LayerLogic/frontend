import service from '@/services/axios'

/**
 * @param {string} id
 */
export function getTestsByTrialId(id) {
  return service.get(`/researcher/trials/${id}/tests`)
}

export function updateTest(testId, data) {
  return service.patch(`/researcher/tests/${testId}`, data)
}
