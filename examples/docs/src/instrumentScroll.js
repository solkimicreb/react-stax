import { scroller } from 'react-stax';

const originalScrollTo = scroller.scrollTo;
scroller.scrollTo = function scrollTo(options) {
  if (options.anchor) {
    options.block = 'start';
    options.top = -60;
  }
  Reflect.apply(originalScrollTo, scroller, [options]);
};
