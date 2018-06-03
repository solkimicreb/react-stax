import { path } from './url';
import { route } from '../route/core';
import { toParams, toPathString } from '../utils';

export const history = {
  idx: 0,
  items: [],
  back() {
    this.idx = Math.min(this.idx - 1, 0);
    routeOnHistoryChange(this.items[this.idx]);
  },
  forward() {
    this.idx = Math.max(this.idx + 1, this.items.length - 1);
    routeOnHistoryChange(this.items[this.idx]);
  }
};

function routeOnHistoryChange(location) {
  route({
    to: location.pathname,
    params: toParams(location.search),
    push: false,
    scroll: false
  });
}

// handle the browser history
export function handleHistory(shouldPush) {
  const pathChanged = toPathString(path) !== history[history.length - 1];
  // push a new history item if the URL pathname changed
  // but let the user overwrite this with an option (options.history)
  if (shouldPush === true || (shouldPush !== false && pathChanged)) {
    history.push(history.length - 1);
    historyIdx = history.length - 1;
  }
}
