import { observable, observe } from '@nx-js/observer-util';
import { Queue, priorities } from '@nx-js/queue-util';
import { toPathString, toUrl } from './utils';
import { route } from './core';

export const elements = {
  anchor: 'a',
  div: 'div'
};

export const scroller = {
  scrollToAnchor() {},
  scrollToLocation() {}
};

export const animation = {
  setup() {},
  enter() {},
  leave() {}
};

// commit reactions with a low priority
// URL and storage updates are not something the user is eagerly waiting for
export const scheduler = new Queue(priorities.LOW);

export const storage = observable({});
export const params = observable({});
export const path = observable([]);

export const history = {
  items: [{}],
  idx: 0,
  push(item) {
    this.items.splice(++this.idx, Infinity, cloneItem(item));
  },
  replace(item) {
    this.items[this.idx] = cloneItem(item);
  },
  go(idx) {
    this.idx = Math.min(this.items.length - 1, Math.max(0, idx));
    const { path, params, scroll } = this.items[this.idx];
    return route({
      to: toPathString(path),
      params,
      scroll,
      push: false
    });
  },
  back() {
    this.go(this.idx - 1);
  },
  forward() {
    this.go(this.idx + 1);
  }
};

function cloneItem({ path, params, scroll, url }) {
  return {
    path: Array.from(path),
    params: Object.assign({}, params),
    scroll: Object.assign({}, scroll),
    url
  };
}

function syncHistory() {
  const { scroll } = history.items[history.idx];
  const url = toUrl({ path, params, scroll });
  history.replace({ path, params, scroll, url });
}
observe(syncHistory, { scheduler });
