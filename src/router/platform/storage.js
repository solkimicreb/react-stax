import { observe } from '@nx-js/observer-util';
import { storage, scheduler } from '../integrations';

const STORAGE_NAME = 'REACT_EASY_STORAGE';
Object.assign(storage, JSON.parse(localStorage.getItem(STORAGE_NAME)));

// auto sync the storage object with localStorage
function syncStorage() {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(storage));
}
observe(syncStorage, { scheduler });
