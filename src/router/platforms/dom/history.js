import { history } from '../../integrations';
import { route } from '../../core';
import { toPathString, toUrl } from '../../utils';

const originalPush = history.push;
const originalReplace = history.replace;
Object.assign(history, {
  push(item) {
    Reflect.apply(originalPush, history, [item]);
    window.history.pushState({ idx: history.idx }, '', toUrl(item));
  },
  replace(item) {
    Reflect.apply(originalReplace, history, [item]);
    window.history.replaceState(window.history.state, '', toUrl(item));
  }
});

window.addEventListener('popstate', ev => {
  const idx = ev.state ? ev.state.idx : 0;
  const { path, params, scroll } = history.go(idx);

  return route({
    to: toPathString(path),
    params,
    scroll,
    push: false
  });
});
