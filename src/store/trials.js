import { defineStore } from 'pinia'
import { getTrialById, getAlltrials, updatetrial, deletetrial, createtrial } from '@/api/trial'
import { useTestsStore } from '@/store/tests'
import { TrialSchema } from '@/utils/schemas'
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

export const useTrialsStore = defineStore('trials', {
  state: () => ({
    trialsIDs: [],
    currentTrialIndex: 0,
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
      const response = await getAlltrials()
      const data = handleApiResponse(response, messages.fetching.trials.multiple.failure)
      const trials = data.map((trial) => TrialSchema.parse(trial))
      this.trialsIDs = trials.map((trial) => trial._id)
      return trials
    },
    /**
     * @param {String} trialId
     * @param {Object} trialData
     * @returns {Object}
     */
    async updateTrialStore(trialId, trialData) {
      if (!trialId || !trialData) return
      const response = await updatetrial(trialId, trialData)
      const data = handleApiResponse(response, messages.trials.updated.general.failure)
      const updatedTrial = TrialSchema.parse(data)
      return updatedTrial
    },
    /**
     * @param {String} trialId
     * @returns {Object}
     */
    async fetchTrialWithTestsStore(trialId) {
      // First get the trial data
      const trialResponse = await getTrialById(trialId)
      const trialData = handleApiResponse(trialResponse, messages.fetching.trials.single.failure)
      const trial = TrialSchema.parse(trialData)
      // Then get all tests for this trial
      const testsStore = useTestsStore()
      const tests = await testsStore.getTestsByTrialIdStore(trialId)
      trial.tests = tests
      return trial
    },

    /**
     * @param {String} trialId
     * @returns {Object} An object with the success message attached as the attribute "message"
     */
    async deleteTrialStore(trialId) {
      if (!trialId) return
      const response = await deletetrial(trialId)
      const result = handleApiResponse(response, messages.trials.deleted.failure)

      //Optimistic approach when deleting trials
      this.trialsIDs = this.trialsIDs.filter((id) => id !== trialId)

      return result.message
    },

    /**
     * @param {Object} trialData
     * @returns {Object} The newly created trial
     */
    async createTrialStore(trialData) {
      if (!trialData) return
      const response = await createtrial(trialData)
      const data = handleApiResponse(response, messages.trials.created.failure)
      const trial = TrialSchema.parse(data.newTrial)

      return trial //returned if needed but not used atm
    },
    /**
     * @returns {String} The previous trial's id if it exists, otherwise current's
     */
    prevTrial() {
      if (this.currentTrialIndex > 0) {
        this.currentTrialIndex -= 1
        return this.trialsIDs[this.currentTrialIndex]
      }
      return this.trialsIDs[this.currentTrialIndex]
    },
    /**
     * @returns {String} The next trial's id if it exists, otherwise current's
     */
    nextTrial() {
      if (this.currentTrialIndex <= this.trialsIDs.length - 2) {
        this.currentTrialIndex += 1
        return this.trialsIDs[this.currentTrialIndex]
      }
      return this.trialsIDs[this.currentTrialIndex]
    },
  },
})
