const _ = require(`lodash`)
import { reporter } from "gatsby-reporter"
const redux = require(`../redux`)
const { emitter } = redux

let saveInProgress = false
async function saveState() {
  if (saveInProgress) return
  saveInProgress = true

  try {
    await redux.saveState()
  } catch (err) {
    reporter.warn(`Error persisting state: ${(err && err.message) || err}`)
  }

  saveInProgress = false
}
const saveStateDebounced = _.debounce(saveState, 1000)

/**
 * Starts listening to redux actions and triggers a database save to
 * disk upon any action (debounced to every 1 second)
 */
function startAutosave() {
  saveStateDebounced()
  emitter.on(`*`, () => saveStateDebounced())
}

module.exports = {
  startAutosave,
  saveState,
}
