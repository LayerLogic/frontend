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
 * @param {Object} element An id to search between element id's in the array
 * @returns The index of the first element with the provided id in the array, otherwise -1
 */
export function findIndexById(array, element) {
  const index = array.findIndex((e) => (e.id || e._id) === (element.id || element._id))
  return index
}

/**
 * @param {Object[]} array An array of any type of elements that each have a readable id or _id attribute
 * @param {String} elementId An id to search between element id's in the array
 * @returns A new array with the elements that have the id or _id of the provided element removed
 */
export function removeElemsById(array, elementId) {
  const newArray = array.filter((e) => (e.id || e._id) !== elementId)
  return newArray
}

export function isTextEmpty(text) {
  return (
    !text || text.trim() === '' || text === '<p><br></p>' || text === '<br>' || text === '&nbsp;'
  )
}
