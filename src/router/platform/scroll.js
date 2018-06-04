import { path } from '../integrations';
import { toPathString, toParams, toHash } from '../utils';

// this is happening too early here!! (anchor is not there yet)
handleScroll(toParams(location.hash));

// handle scrolling
export function handleScroll(scroll) {
  if (typeof scroll === 'object') {
    // scroll to a given anchor if the options or URL hash indicate it
    if (scroll.to) {
      const scrollAnchor = document.querySelector(scroll.to);
      if (scrollAnchor) {
        // save scroll anchors in the url hash
        history.replaceState(history.state, '', toHash(scroll));
        scrollAnchor.scrollIntoView(scroll);
      }
    } else {
      // scroll a given container (the window by default)
      const container = scroll.container
        ? document.querySelector(scroll.container)
        : window;
      // scroll to the user defined position otherwise
      container.scrollTo(scroll);
    }
  } else if (scroll !== false && toPathString(path) !== location.pathname) {
    // route to the top left corner by default, if the URL path changed
    // and the scroll option is not false
    window.scrollTo({ left: 0, top: 0 });
  }
}
