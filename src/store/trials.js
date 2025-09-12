import { defineStore } from 'pinia'
import { getTrialById, getAlltrials } from '@/api/trial'
import { getTestsByTrialId } from '@/api/test'


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

export const useTrialsStore = defineStore('trials', {
  state: () => ({
    trialsIDs: [],
    currentTrialIndex: 0
  }),

  getters: {
    getTrialsIDs() {
      return this.trialsIDs
    },
  },

  actions: {
    /**
     * @returns {Object}
     */
    async fetchTrialsStore() {
        return this.executeApiCall (async () => {
        const response = await getAlltrials()
        const data = handleApiResponse(response, 'Failed to fetch trials')
        this.trialsIDs = data.map(trial => trial._id)
        return data
        },
        "Error fetching trials")
    },
    /**
     * @param {String} trialId
     * @returns {Object}
     */
    async fetchTrialWithTestsStore(trialId) {
        return this.executeApiCall(async () => {
            // First get the trial data
            const trialResponse = await getTrialById(trialId)
            const trial = trialResponse.data

            // Then get all tests for this trial
            const testResponse = await getTestsByTrialId(trialId)
            trial.tests = testResponse.data.data
            return trial
        }, 'Error fetching trial or tests:')
    },
    /**
     * Generic API request handler with loading and error states
     * @returns {String}
     */
    prevTrial(){
        if (this.currentTrialIndex > 0){
            this.currentTrialIndex -= 1
            return this.trialsIDs[this.currentTrialIndex]
        }
        return this.trialsIDs[this.currentTrialIndex]
    },
    nextTrial(){
        if (this.currentTrialIndex <= this.trialsIDs.length - 2){
            this.currentTrialIndex += 1
            return this.trialsIDs[this.currentTrialIndex]
        }
        return this.trialsIDs[this.currentTrialIndex]
    },

    /**
     * Generic API request handler with loading and error states
     * @param {Function} apiCall - Function that makes the API call
     * @param {string} errorMsg - Default error message
     * @returns {Promise<Object>}
     */
    async executeApiCall(apiCall, errorMsg) {
      try {
        const result = await apiCall()
        return result
      } catch (error) {
        console.error(errorMsg, error)
        throw error
      }
    }
  },
})
