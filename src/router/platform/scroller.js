import { scroller } from '../integrations';
import { toScroll } from '../utils';

Object.assign(scroller, {
  scrollToAnchor(options) {
    const anchor = document.getElementById(options.anchor);
    if (anchor) {
      anchor.scrollIntoView(options);
      return true;
    }
  },
  scrollToLocation(options) {
    const container = options.container
      ? document.getElementById(options.container)
      : window;
    container.scrollTo(options);
  }
});

const { anchor } = toScroll(location.hash);
if (anchor) {
  const RETRY_INTERVAL = 100;
  const FAIL_AFTER = 3000;
  const start = Date.now();

  function initialScroll() {
    const didScroll = scroller.scrollToAnchor({ anchor });
    if (!didScroll && Date.now() - start < FAIL_AFTER) {
      setTimeout(initialScroll, RETRY_INTERVAL);
    }
  }
  initialScroll();
}
