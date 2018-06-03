import { path } from '../integrations';
import { route } from '../core';
import { toParams, toPathString } from '../utils';

// handle the browser history
export function handleHistory(shouldPush) {
  const pathChanged = toPathString(path) !== location.pathname;
  // push a new history item if the URL pathname changed
  // but let the user overwrite this with an option (options.history)
  if (shouldPush === true || (shouldPush !== false && pathChanged)) {
    history.pushState(history.state, '');
  }
}

// trigger the necessary routing on browser history events
window.addEventListener('popstate', () =>
  route({
    to: location.pathname,
    params: toParams(location.search),
    push: false,
    scroll: false
  })
);
