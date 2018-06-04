import { history } from '../integrations';
import { route } from '../core';
import { toPathString, toQuery } from '../utils';

const originalPush = history.push;
const originalReplace = history.replace;
Object.assign(history, {
  push(item) {
    Reflect.apply(originalPush, history, [item]);
    console.log('push', history.idx, item);
    const url = toPathString(item.path) + toQuery(item.params) + location.hash;
    window.history.pushState({ idx: history.idx }, '', url);
  },
  replace(item) {
    Reflect.apply(originalReplace, history, [item]);
    const url = toPathString(item.path) + toQuery(item.params) + location.hash;
    console.log('replace', window.history.state, history.idx);
    window.history.replaceState(window.history.state, '', url);
  }
});

window.addEventListener('popstate', ev => {
  const idx = ev.state ? ev.state.idx : 0;
  console.log('go', idx);
  const { params, path } = history.go(idx);

  return route({
    to: toPathString(path),
    params,
    push: false,
    scroll: false
  });
});
