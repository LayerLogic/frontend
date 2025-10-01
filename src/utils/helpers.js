import { toast } from "vue-sonner"

/**
 * Resets states according to: booleans to false, strings to the empty string (''), and numbers to 0
 * @param {Object} state The reactive Vue state
 * @param {String[]} keys Strings of the states to be reset
 */
export function resetEditingStates(state, keys) {
  keys.forEach((key) => {
    if (typeof state[key] === 'string') state[key] = ''
    if (typeof state[key] === 'boolean') state[key] = false
    if (typeof state[key] === 'number') state[key] = 0 //unused atm
  })
}

/**
 * @param {Object} state The reactive Vue state
 * @param {String} key String of the boolean to be toggled
 */
export function toggleBoolStates(state, key) {
  if (typeof state[key] === 'boolean') state[key] = !state[key]
}

/**
 * @param {Object[]} array An array of any type of elements that each have a readable id or _id attribute
 * @param {Object} element An element that has a readable id or _id attribute
 * @returns The index of the element in the array, otherwise -1
 */
export function findIndexById(array, element) {
  const index = array.findIndex((e) => (e.id || e._id) === (element.id || element._id))
  return index
}

/**
 * Executes an API call and displays results
 * @param {Function} apiCall The function to execute 
 * @param {String} errorMsg Error message to log to the console and display via toasts
 * @param {String|null} [successMsg=null] Success message to display via toasts
 * @returns {Promise<Object>} Result of the API call
 */
export async function executeApiCallWithToasts(apiCall, errorMsg, successMsg=null) {
  try {
    const result = await apiCall()
    if (successMsg) toast.success(successMsg)
    return result
  } catch (error) {
    console.error(errorMsg,':', error)
    toast.error(error.message ?? errorMsg)
    throw error
  }
}


