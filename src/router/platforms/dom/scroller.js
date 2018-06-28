import { scroller } from '../../integrations';
import { toScroll } from '../../utils';

Object.assign(scroller, {
  scrollTo(options) {
    if (options.anchor) {
      const anchor = document.getElementById(options.anchor);
      if (anchor) {
        anchor.scrollIntoView(options);
        window.scrollBy(options);
      }
    } else {
      window.scrollTo(options);
    }
  }
});

const scroll = toScroll(location.hash);
const RETRY_INTERVAL = 100;
const RETRY_TIMEOUT = 5000;
const start = Date.now();

function initialScroll() {
  scroller.scrollTo(scroll);
  if (scroll.anchor) {
    const hasAnchor = document.getElementById(scroll.anchor);
    const hasTime = Date.now() - start < RETRY_TIMEOUT;
    if (!hasAnchor && hasTime) {
      setTimeout(initialScroll, RETRY_INTERVAL);
    }
  }
}
initialScroll();
