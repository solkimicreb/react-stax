import { toWidgetType, toStoreType } from './types'

const STORAGE_NAME = 'STORAGE'
const storage = JSON.parse(localStorage.getItem(STORAGE_NAME))

export function syncStorage (config, store) {
  for (let key of config.storage) {
    storage[key] = toWidgetType(store[key], true)
  }
  localStorage.setItem(STORAGE_NAME, JSON.stringify(storage))
}

export function syncStoreWithStorage (config, store) {
  for (let key of config.storage) {
    if (storage[key] !== undefined) {
      store[key] = toStoreType(storage[key], store[key])
    }
  }
}
