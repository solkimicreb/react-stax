import { observable, observe } from '@nx-js/observer-util';
import { Queue, priorities } from '@nx-js/queue-util';

// commit reactions with a low priority
// URL and storage updates are not something the user is eagerly waiting for
export const scheduler = new Queue(priorities.LOW);

export const storage = observable({});
export const params = observable({});
export const path = observable([]);

export const history = {
  items: [],
  idx: 0,
  go(idx) {
    this.idx = idx;
    return this.items[idx];
  },
  push(item) {
    this.items.splice(++this.idx, Infinity, cloneItem(item));
  },
  replace(item) {
    this.items[this.idx] = cloneItem(item);
  }
};

function cloneItem({ path, params }) {
  return {
    path: Array.from(path),
    params: Object.assign({}, params)
  };
}

function syncHistory() {
  history.replace({ path, params });
}
observe(syncHistory, { scheduler });
