import { scroller } from 'react-easy-stack';

// ISSUE: anchor routing messes up animation offsets!
const originalScrollToAnchor = scroller.scrollToAnchor;
scroller.scrollToAnchor = function scrollToAnchor(options) {
  options.block = options.block || 'start';
  const result = Reflect.apply(originalScrollToAnchor, scroller, [options]);
  const container = document.getElementById('root');
  container.scrollBy({ top: -60 });
  return result;
};
