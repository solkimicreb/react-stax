const STORAGE_NAME = 'STORAGE'
export const storage = JSON.parse(localStorage.getItem(STORAGE_NAME)) || {}

export function syncStorage (config, store) {
  for (let key of config.storage) {
    storage[key] = store[key]
  }
  localStorage.setItem(STORAGE_NAME, JSON.stringify(storage))
}
