import { history } from '../../integrations';
import { route } from '../../core';

const originalPush = history.push;
const originalReplace = history.replace;
Object.assign(history, {
  push(item) {
    item = Reflect.apply(originalPush, history, [item]);
    window.history.pushState({ idx: history.idx }, '', item.url);
  },
  replace(item) {
    item = Reflect.apply(originalReplace, history, [item]);
    window.history.replaceState(window.history.state, '', item.url);
  }
});

window.addEventListener('popstate', ev =>
  history.go(ev.state ? ev.state.idx : 0)
);
