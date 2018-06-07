import { observable, observe } from "@nx-js/observer-util";
import { Queue, priorities } from "@nx-js/queue-util";
import { toPathString, toUrl, toObject } from "./utils";
import { route } from "./core";

export const elements = {
  anchor: "a",
  div: "div"
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
    item = createHistoryItem(item);
    this.items.splice(++this.idx, Infinity, item);
    return item;
  },
  replace(item) {
    item = createHistoryItem(item);
    this.items[this.idx] = item;
    return item;
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

function createHistoryItem(item = {}) {
  if (typeof item === "string") {
    item = toObject(item);
  }
  item = {
    path: Array.from(item.path),
    params: Object.assign({}, item.params),
    scroll: Object.assign({}, item.scroll),
    url: toUrl(item)
  };
  // update the params and path to reflect the new history item
  Object.assign(params, item.params);
  path.splice(0, Infinity, ...item.path);
  return item;
}

function syncHistory() {
  const { scroll } = history.items[history.idx];
  history.replace({ path, params, scroll });
}
observe(syncHistory, { scheduler });
