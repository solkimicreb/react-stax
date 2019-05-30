import { scroller } from "../../integrations";
import { toScroll } from "../../utils";

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

// do an initial scrolling if there is scroll data in the url hash
// and the page is not visited by a reload or history event in the same session
const RELOAD_KEY = "STAX_RELOADED";
const RETRY_INTERVAL = 100;
const RETRY_TIMEOUT = 5000;
const scroll = toScroll(location.hash);

if (typeof scroll === "object" && !sessionStorage.getItem(RELOAD_KEY)) {
  const start = Date.now();

  function initialScroll() {
    scroller.scrollTo(scroll);
    if (scroll.anchor) {
      // in case of a scroll anchor we have to wait for the anchor to
      // be mounted on the page, before the scrolling
      // do a simple retry tactic with a fixed interval and timeout in this case
      const hasAnchor = document.getElementById(scroll.anchor);
      const hasTime = Date.now() - start < RETRY_TIMEOUT;
      if (!hasAnchor && hasTime) {
        setTimeout(initialScroll, RETRY_INTERVAL);
      }
    }
  }
  initialScroll();
}
sessionStorage.setItem(RELOAD_KEY, true);
