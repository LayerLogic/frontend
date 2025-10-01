import { defineStore } from 'pinia'
import { getTestsByTrialId, deleteTestByTestId, updateTest } from '@/api/test'
import { TestSchema } from '@/utils/schemas'
import messages from '@/utils/messages.json'

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

export const useTestsStore = defineStore('tests', {
  actions: {
    /**
     * @param {String} trialId
     * @returns {Array}
     */
    async getTestsByTrialIdStore(trialId) {
      // Get all tests for this trial
      const testResponse = await getTestsByTrialId(trialId)
      const data = handleApiResponse(testResponse, messages.fetching.tests.failure)
      const tests = data.data.map((test) => TestSchema.parse(test))
      return tests
    },
    /**
     * @param {String} testId
     * @returns {String}
     */
    async deleteTestByTestIdStore(testId) {
      // Get all tests for this trial
      const testResponse = await deleteTestByTestId(testId)
      const data = handleApiResponse(testResponse, messages.tests.deleted.failure)
      return data.message
    },
    /**
     * @param {String} testId
     * @param {Object} testData
     * @returns {Object}
     */
    async updateTestStore(testId, testData) {
      const testResponse = await updateTest(testId, testData)
      const data = handleApiResponse(testResponse, messages.tests.updated.general.failure)
      const test = TestSchema.parse(data)
      return test //return updated test, though not used atm in TrialView
    },
  },
})
