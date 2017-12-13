import { observable, observe } from '@nx-js/observer-util'
import { Queue, priorities } from '@nx-js/queue-util'

const STORAGE_NAME = 'STORAGE'
const rawStorage = JSON.parse(localStorage.getItem(STORAGE_NAME)) || {}
export const storage = observable(rawStorage)
export const storageScheduler = new Queue(priorities.LOW)

function syncStorage (config, store) {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(storage))
}

observe(syncStorage, { scheduler: storageScheduler })
