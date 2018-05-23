import { observable, observe } from '@nx-js/observer-util';
import { isNode } from '../utils';
import scheduler from './scheduler';

const STORAGE_NAME = 'REACT_EASY_STORAGE';
const item = !isNode ? localStorage.getItem(STORAGE_NAME) : null;
export const storage = observable(JSON.parse(item) || {});

// auto sync the storage object with localStorage in the browser
if (!isNode) {
  function syncStorage() {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(storage));
  }
  observe(syncStorage, { scheduler });
}
