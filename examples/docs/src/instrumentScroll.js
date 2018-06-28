import { scroller } from 'react-easy-stack';

// ISSUE: anchor routing messes up animation offsets!
const originalScrollTo = scroller.scrollTo;
scroller.scrollTo = function scrollTo(options) {
  if (options.anchor) {
    options.block = 'start';
    options.top = -60;
  }
  return Reflect.apply(originalScrollTo, scroller, [options]);
};
