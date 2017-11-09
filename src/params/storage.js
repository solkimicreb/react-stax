import { observable, observe } from '@nx-js/observer-util'

const STORAGE_NAME = 'STORAGE'
const rawStorage = JSON.parse(localStorage.getItem(STORAGE_NAME)) || {}
export const storage = observable(rawStorage)

function syncStorage (config, store) {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(storage))
}
observe(syncStorage)
