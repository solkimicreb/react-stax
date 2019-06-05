import { observable, observe } from '@nx-js/observer-util'
import { schedulers } from 'utils'

export const storage = observable()

const STORAGE_NAME = 'STAX_STORAGE'
Object.assign(storage, JSON.parse(localStorage.getItem(STORAGE_NAME)))

// auto sync the storage object with localStorage
function syncStorage () {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(storage))
}
// localStorage sync can be done with a low priority, the user won't notice
observe(syncStorage, { scheduler: schedulers.low })
