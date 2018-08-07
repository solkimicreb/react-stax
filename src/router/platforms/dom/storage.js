import { observe } from '@nx-js/observer-util'
import { storage } from '../../integrations'
import { integrations as scheduler } from '../../../schedulers'

const STORAGE_NAME = 'STAX_STORAGE'
Object.assign(storage, JSON.parse(localStorage.getItem(STORAGE_NAME)))

// auto sync the storage object with localStorage
function syncStorage() {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(storage))
}
observe(syncStorage, { scheduler })
