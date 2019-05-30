import { observable, observe, raw } from "@nx-js/observer-util";
import { toPathString, toUrl, toObject, replace } from "./utils";
import { route } from "./core";
import * as schedulers from "../schedulers";

export const elements = {
  anchor: "a",
  div: "div"
};

export const scroller = {
  scrollTo() {}
};

export const storage = observable();
export const params = observable();
export const session = observable();
export const path = observable([]);

export const history = [{}];
let idx = 0;

function createHistoryItem(item = {}) {
  return {
    // raw (non Proxied) versions must be used here
    // Proxies can not be serialized by browsers
    path: Array.from(raw(item.path)),
    params: Object.assign({}, raw(item.params)),
    session: Object.assign({}, raw(item.session)),
    // scroll config can be passed without copying as it is read-only
    scroll: item.scroll,
    url: toUrl(item),
    idx
  };
}

// TODO: this must be batched! (for the scheduler)
function updateCurrent(item) {
  replace(path, item.path);
  replace(params, item.params);
  replace(session, item.session);
}

Object.defineProperties(history, {
  current: {
    get: () => history[idx]
  }
});

Object.assign(history, {
  push(item) {
    item = createHistoryItem(item);
    history.splice(++idx, Infinity, item);
    updateCurrent(item);
    return item;
  },
  replace(item) {
    item = createHistoryItem(item);
    history[idx] = item;
    updateCurrent(item);
    return item;
  },
  go(offset) {
    idx = Math.min(history.length - 1, Math.max(0, idx + offset));
    const { path, params, session } = history[idx];
    return route({
      to: toPathString(path),
      params,
      session,
      scroll: false,
      push: false
    });
  },
  get(offset) {
    const getIdx = Math.min(history.length - 1, Math.max(0, idx + offset));
    return history[getIdx];
  }
});

function syncHistory() {
  history.replace({ path, params, session, scroll: history.current.scroll });
}
// the URL and history can be updated with a low priority, the user won't notice
observe(syncHistory, { scheduler: schedulers.low });
