import { observable, observe } from '@nx-js/observer-util'
import { scheduler } from '../utils'

const STORAGE_NAME = 'REACT_EASY_STORAGE'
export const storage = observable(
  JSON.parse(localStorage.getItem(STORAGE_NAME)) || {}
)

function syncStorage () {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(storage))
}

observe(syncStorage, { scheduler })
