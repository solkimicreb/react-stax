import { history } from '../../integrations';
import { route } from '../../core';
import { toPathString } from '../../utils';

Object.defineProperties(history, {
  state: {
    get: () => window.history.state
  },
  length: {
    get: () => window.history.length
  }
});

Object.assign(history, {
  push(item) {
    item = history.createItem(item);
    window.history.pushState(item, '', item.url);
  },
  replace(item) {
    item = history.createItem(item);
    window.history.replaceState(item, '', item.url);
  },
  go(to) {
    return window.history.go(to);
  },
  forward() {
    return window.history.forward();
  },
  back() {
    return window.history.back();
  }
});

window.addEventListener('popstate', ev => {
  const { path, params, scroll } = ev.state;
  return route({
    to: toPathString(path),
    params,
    scroll,
    push: false
  });
});
