import { observable, observe } from '@nx-js/observer-util'
import { scheduler, localStorage } from 'env'

export let storage
const STORAGE_NAME = 'REACT_EASY_STORAGE'
const item = localStorage.getItem(STORAGE_NAME)

if (item instanceof Promise) {
  storage = observable()
  item.then(item => Object.assign(storage, JSON.parse(item)))
} else {
  storage = observable(JSON.parse(item) || {})
}

function syncStorage () {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(storage))
}

observe(syncStorage, { scheduler })
